// hooks/useLLMTrade.js
import { useState, useCallback } from 'preact/hooks';
import { aggressiveTrader, conservativeTrader, technicalTrader, twitterTrader } from '../assets/data/data';

const useLLM = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [llmResponse, setLlmResponse] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  let lastTradeData = null;
  let cachedResponse = null;

  function generateTradeResponseStream(tradeData) {
    const responseString = `*Trade Call*
  
  *Call Type:* ${tradeData.type.toUpperCase()}
  *Symbol:* ${tradeData.tickerSymbol}
  *Entry Price:* ${tradeData.price?.main || tradeData.exitPrice}
  *Stop Loss:* ${tradeData.stopLoss}
  *Targets:* ${Array.isArray(tradeData.targets) ? tradeData.targets.join('-') : tradeData.targets}
  *Notes:* ${tradeData.notes || "N/A"}`;
  
    // Create a new ReadableStream
    const stream = new ReadableStream({
      start(controller) {
        // Encode the string as Uint8Array
        const encodedString = new TextEncoder().encode(responseString);
  
        // Enqueue the encoded data into the stream
        controller.enqueue(encodedString);
  
        // Close the stream
        controller.close();
      },
    });
  
    return stream;
  }
  

  // const generateLLMResponse = useCallback(async (tradeData) => {
  //   if (JSON.stringify(tradeData) === JSON.stringify(lastTradeData)) {
  //     console.log('cc resp', cachedResponse);
  //     return { data: () => Promise.resolve(cachedResponse) };
  //   }

  //   try {
  //     console.log('trade params', tradeData);
  //     const response = await fetch('http://localhost:3080/generate-trade-call', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         templates: [{ twitterTrader }], // Add your templates here
  //         tradeParams: {
  //           call_type: tradeData.type.toUpperCase(),
  //           symbol: tradeData.tickerSymbol,
  //           entry_price: tradeData.price?.main || tradeData.exitPrice,
  //           stop_loss: tradeData.stopLoss,
  //           targets: Array.isArray(tradeData.targets) ? tradeData.targets : [tradeData.targets],
  //           notes: tradeData.notes
  //         },
  //       }),
  //     });



  //     if (!response.ok) {
  //       throw new Error('Failed to generate trade call');
  //     }

  //     // Store the tradeData and response for caching
  //     lastTradeData = tradeData;
      
  //     // Handle both text and stream responses
  //     if (response.headers.get("content-type")?.includes("application/json")) {
  //       const data = await response.json();
  //       cachedResponse = data; 
  //       return { data: () => Promise.resolve(data) };
  //     } else {
  //       const reader = response.body.getReader();
  //       const decoder = new TextDecoder("utf-8");
  //       let result = '';

  //       const readStream = async () => {
  //         try {
  //           while (true) {
  //             const { done, value } = await reader.read();
  //             if (done) break;
  //             result += decoder.decode(value, { stream: true });
  //           }
  //           return result;
  //         } catch (error) {
  //           console.error("Error reading llmResponse:", error);
  //           throw new Error("Error reading response.");
  //         }
  //       };
  //       const data = await readStream();
  //       cachedResponse = data;
  //       return { data: () => Promise.resolve(data) };
  //     }

  //   } catch (error) {
  //     console.error('Error generating LLM response:', error);
  //     throw error;
  //   }
  // }, []);

  const generateLLMResponse = useCallback(async (tradeData) => {
    // Helper function to read a stream (defined within generateLLMResponse)
    const readStream = async (reader) => {
      const decoder = new TextDecoder("utf-8");
      let result = '';
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
      } finally {
        reader.releaseLock();
      }
    };

    if (JSON.stringify(tradeData) === JSON.stringify(lastTradeData)) {
      console.log('cc resp', cachedResponse);
      return {
        body: cachedResponse,
        data: () => readStream(cachedResponse.getReader()) // Now readStream is accessible
      };
    }

    try {
      console.log('trade params', tradeData);

      // Generate the mock stream
      const responseStream = generateTradeResponseStream(tradeData);

      // Store the tradeData and the stream for caching
      lastTradeData = tradeData;
      cachedResponse = responseStream;

      return {
        body: responseStream,
        data: () => readStream(responseStream.getReader()) // readStream is accessible here too
      };

    } catch (error) {
      // Handle errors during stream generation or other issues
      console.error('Error generating LLM response:', error);
      throw new Error('Error generating trade response'); // Customize error message
    }
  }, []);
  

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
      const result = await response.data(); // Get the data using the data() function
      setLlmResponse(result);
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
      const finalResponse = await response.data(); // Get the data using the data() function

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