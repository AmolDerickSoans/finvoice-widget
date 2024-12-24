import { useState, useRef, useEffect } from 'react';

// Custom hook to handle all keyboard interactions
const useKeyboardNavigation = (initialFormData, initialExpandedFields) => {
  const [formData, setFormData] = useState(initialFormData);
  const [currentFocus, setCurrentFocus] = useState('type');
  const [expandedFields, setExpandedFields] = useState(initialExpandedFields);

  // Input refs
  const inputRefs = {
    type: useRef(null),
    stockSearch: useRef(null),
    price: useRef(null),
    price2: useRef(null),
    stopLoss: useRef(null),
    target: useRef(null),
    target2: useRef(null),
    target3: useRef(null),
    copy: useRef(null)
  };

  // Navigation map defining field relationships
  const navigationMap = {
    type: {
      right: 'stockSearch',
      down: 'stopLoss',
    },
    stockSearch: {
      left: 'type',
      right: 'price',
      down: 'stopLoss',
    },
    price: {
      left: 'stockSearch',
      right: expandedFields.price2 ? 'price2' : 'stopLoss',
      down: 'stopLoss',
    },
    price2: expandedFields.price2 ? {
      left: 'price',
      right: 'stopLoss',
      down: 'stopLoss',
    } : null,
    stopLoss: {
      left: expandedFields.price2 ? 'price2' : 'price',
      right: 'target',
      up: expandedFields.price2 ? 'price2' : 'price',
    },
    target: {
      left: 'stopLoss',
      right: expandedFields.target2 ? 'target2' : 'type',
      up: 'stopLoss',
    },
    target2: expandedFields.target2 ? {
      left: 'target',
      right: expandedFields.target3 ? 'target3' : 'type',
      up: 'target',
    } : null,
    target3: expandedFields.target3 ? {
      left: 'target2',
      up: 'target2',
    } : null,
  };

  // Main keyboard event handler
  const handleKeyboardEvent = (e) => {
    const { key, target } = e;
    const field = Object.keys(inputRefs).find(k => inputRefs[k].current === target);
    
    // Handle arrow navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
      const direction = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      }[key];
      
      const nextField = navigationMap[field]?.[direction];
      if (nextField) {
        setCurrentFocus(nextField);
      }
      return;
    }

    // Handle field expansion
    if (key === 'Enter') {
      if (field === 'price' && !expandedFields.price2) {
        setExpandedFields(prev => ({ ...prev, price2: true }));
        setCurrentFocus('price2');
      } else if (field === 'target' && !expandedFields.target2) {
        setExpandedFields(prev => ({ ...prev, target2: true }));
        setCurrentFocus('target2');
      } else if (field === 'target2' && !expandedFields.target3) {
        setExpandedFields(prev => ({ ...prev, target3: true }));
        setCurrentFocus('target3');
      }
      return;
    }

    // Handle field collapse
    if (key === 'Backspace' && target.value === '') {
      if (field === 'price2') {
        setExpandedFields(prev => ({ ...prev, price2: false }));
        setCurrentFocus('price');
        setFormData(prev => ({ ...prev, price2: '' }));
      } else if (field === 'target2') {
        setExpandedFields(prev => ({ ...prev, target2: false }));
        setCurrentFocus('target');
        setFormData(prev => ({ ...prev, target2: '' }));
      } else if (field === 'target3') {
        setExpandedFields(prev => ({ ...prev, target3: false }));
        setCurrentFocus('target2');
        setFormData(prev => ({ ...prev, target3: '' }));
      }
      return;
    }

    // Handle type field toggle
    if (field === 'type' && (key === 'Enter' || key === ' ')) {
      setFormData(prev => ({
        ...prev,
        type: prev.type === 'Buy' ? 'Sell' : 'Buy'
      }));
      return;
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle click focus
  const handleClickFocus = (field) => {
    setCurrentFocus(field);
  };

  // Focus effect
  useEffect(() => {
    const ref = inputRefs[currentFocus]?.current;
    if (ref) {
      ref.focus();
    }
  }, [currentFocus]);

  const resetForm = () => {
    // Reset all form data to initial values
    setFormData(initialFormData);
    // Reset expanded fields
    setExpandedFields(initialExpandedFields);
    // Reset focus to first field
    setCurrentFocus('type');
  };

  return {
    formData,
    currentFocus,
    expandedFields,
    inputRefs,
    handleKeyboardEvent,
    handleInputChange,
    handleClickFocus,
    resetForm
  };
};

export default useKeyboardNavigation;