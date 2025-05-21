import { useState, useEffect } from 'react';

const useFetchCF7Forms = () => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('/wp-json/divi-cf7-styler/v1/get-forms');
        if (!response.ok) {
          throw new Error('Failed to fetch Contact Form 7 forms');
        }
        const data = await response.json();
        setForms(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);

  return { forms, isLoading, error };
};

export default useFetchCF7Forms;
