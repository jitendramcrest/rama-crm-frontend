import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | RAMA-CRM` : 'RAMA-CRM';
  }, [title]);
};

export default usePageTitle;
