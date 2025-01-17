import {h} from 'preact';
import { useState, useEffect} from 'preact/hooks';
import { X } from 'lucide-preact';
import Markdown from 'preact-markdown';
import useLLM from '../../hooks/useLLM';

const SkeletonLoader = () => (
  <div className="p-4">
    <div className="bg-gray-200 h-4 w-1/2 rounded mb-2 animate-pulse" />
    <div className="bg-gray-200 h-4 w-1/4 rounded mb-2 animate-pulse" />
    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2 animate-pulse" />
    <div className="bg-gray-200 h-4 w-1/2 rounded mb-2 animate-pulse" />
    <div className="bg-gray-200 h-4 w-2/3 rounded mb-2 animate-pulse" />
  </div>
);

const PreviewModal = ({ isOpen, onClose, data, loading, llmResponse, setLlmResponse }) => {
  if (!isOpen) return null;
  let [parsedResponse, setParsedResponse] = useState(null);
  useEffect(() => {
    if (llmResponse) {
      setParsedResponse(llmResponse); // Update parsedResponse with llmResponse
    }
  }, [llmResponse]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Preview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <div className="prose max-w-none">
              {parsedResponse ? (
                <Markdown markdown={parsedResponse} />
              ) : (
                <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
              )}
            </div>
            // <div className="prose max-w-none">
            //    <Markdown markdown={parsedResponse} />
            // </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;