// hooks/useTradeForm.js
import { useState, useCallback, useMemo } from 'preact/hooks';

const initialFormState = {
  stock: {
    value: '',
    name: '',
    isValid: false
  },
  price: {
    main: '',
    secondary: '',
    isRange: false,
    isValid: false
  },
  stopLoss: {
    value: '',
    isValid: false
  },
  targets: {
    values: ['', '', ''],  // Up to 3 targets
    activeCount: 1,        // Number of visible target fields
    isValid: false
  },
  timePeriod: {
    value: 'Intraday',
    isValid: true
  },
  notes: {
    value: '',
    isValid: true         // Notes are optional
  }
};

export const useTradeForm = () => {
  // Core state
  const [formData, setFormData] = useState(initialFormState);
  const [tradeType, setTradeType] = useState('Buy');
  const [currentFocus, setCurrentFocus] = useState('type');
  
  // Field expansion tracking
  const [expandedFields, setExpandedFields] = useState({
    price: false,
    target2: false,
    target3: false
  });

  // Validation helper functions
  const validatePrice = useCallback((price, isRange = false) => {
    if (isRange) {
      const [main, secondary] = price.split('-').map(Number);
      return !isNaN(main) && !isNaN(secondary) && main < secondary;
    }
    return !isNaN(price) && parseFloat(price) > 0;
  }, []);

  const validateTargets = useCallback((targets, price) => {
    const numPrice = parseFloat(price);
    return targets.every((target, index) => {
      if (!target) return index > 0; // Only first target is required
      const numTarget = parseFloat(target);
      if (tradeType === 'Buy') {
        return numTarget > numPrice && 
               (!targets[index - 1] || numTarget > parseFloat(targets[index - 1]));
      }
      return numTarget < numPrice && 
             (!targets[index - 1] || numTarget < parseFloat(targets[index - 1]));
    });
  }, [tradeType]);

  // Field update handlers
  const updateField = useCallback((field, value, subField = null) => {
    setFormData(prev => {
      const newState = { ...prev };
      
      if (subField) {
        newState[field] = {
          ...newState[field],
          [subField]: value
        };
      } else {
        newState[field] = {
          ...newState[field],
          value
        };
      }

      // Update validation
      switch (field) {
        case 'price':
          newState.price.isValid = validatePrice(value, newState.price.isRange);
          break;
        case 'targets':
          newState.targets.isValid = validateTargets(
            newState.targets.values,
            newState.price.main
          );
          break;
        // Add other field validations
      }

      return newState;
    });
  }, [validatePrice, validateTargets]);

  // Handle field expansion
  const handleFieldExpansion = useCallback((field) => {
    setExpandedFields(prev => ({ ...prev, [field]: true }));
    if (field.startsWith('target')) {
      setFormData(prev => ({
        ...prev,
        targets: {
          ...prev.targets,
          activeCount: prev.targets.activeCount + 1
        }
      }));
    }
  }, []);

  // Calculate form progress
  const progress = useMemo(() => {
    const requiredFields = ['stock', 'price', 'stopLoss', 'targets'];
    const validFields = requiredFields.filter(field => formData[field].isValid);
    return (validFields.length / requiredFields.length) * 100;
  }, [formData]);

  // Format form data for submission
  const getFormattedData = useCallback(() => {
    return {
      type: tradeType,
      stockName: formData.stock.name,
      tickerSymbol: formData.stock.value,
      price: {
        main: parseFloat(formData.price.main),
        secondary: formData.price.isRange ? parseFloat(formData.price.secondary) : null
      },
      stopLoss: parseFloat(formData.stopLoss.value),
      targets: formData.targets.values
        .slice(0, formData.targets.activeCount)
        .map(t => parseFloat(t)),
      timePeriod: formData.timePeriod.value,
      notes: formData.notes.value
    };
  }, [formData, tradeType]);

  return {
    formData,
    tradeType,
    currentFocus,
    expandedFields,
    progress,
    setTradeType,
    setCurrentFocus,
    updateField,
    handleFieldExpansion,
    getFormattedData
  };
};