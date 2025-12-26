import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-sm font-medium"
    >
      {currentLang === 'es' ? 'EN' : 'ES'}
    </Button>
  );
};

export default LanguageToggle;
