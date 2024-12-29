// hooks/useLLMTrade.js
import { useState } from 'preact/hooks';
import { aggressiveTrader,conservativeTrader,technicalTrader ,twitterTrader } from '../assets/data/data';

const useLLM = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [llmResponse, setLlmResponse] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  let lastTradeData = null;
  let cachedResponse = null;

  const generateLLMResponse = async (tradeData) => {
    if (JSON.stringify(tradeData) === JSON.stringify(lastTradeData)) {
      return cachedResponse;
    }

    try {
      console.log('trade params' , tradeData)
      const response = await fetch('http://localhost:3080/generate-trade-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templates: [{twitterTrader}], // Add your templates here
          tradeParams: {
            call_type: tradeData.type.toUpperCase(),
            symbol: tradeData.tickerSymbol,
            entry_price: tradeData.price?.main || tradeData.exitPrice,
            stop_loss: tradeData.stopLoss,
            targets: Array.isArray(tradeData.targets) ? tradeData.targets : [tradeData.targets],
            notes: tradeData.notes
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate trade call');
      }

      const data = await response;
      
      lastTradeData = tradeData;
      cachedResponse = data;

      return data;
    } catch (error) {
      console.error('Error generating LLM response:', error);
      throw error;
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard.');
      return false;
    }
  };

  const handlePreview = async (tradeData) => {
    setShowPreview(true);
    setPreviewLoading(true);
    setLlmResponse('');

    try {
      const response = await generateLLMResponse(tradeData);
      console.log("llm returned" , response.body)
      setLlmResponse(response.body);
      return response;
    } catch (error) {
      console.error(error);
      setLlmResponse('Error: ' + error.message);
      throw error;
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (tradeData, onSuccess) => {
    setSubmitLoading(true);
    try {
      const response = await generateLLMResponse(tradeData);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = '';

      const readStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
          }
          return result;
        } catch (error) {
          console.error("Error reading llmResponse:", error);
          throw new Error("Error reading response.");
        }
      };

      const finalResponse = await readStream();
      await copyToClipboard(finalResponse);

      if (onSuccess) onSuccess(finalResponse);
      return finalResponse;
    } catch (error) {
      console.error('Error submitting trade:', error);
      throw error;
    } finally {
      setSubmitLoading(false);
      setShowPreview(false);
    }
  };

  return {
    showPreview,
    setShowPreview,
    previewLoading,
    submitLoading,
    llmResponse,
    handlePreview,
    handleSubmit
  };
};

export default useLLM;