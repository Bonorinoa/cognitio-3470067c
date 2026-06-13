import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const FAQPage = () => {
  const { t } = useTranslation();

  const studentQuestions = [
    { q: t("faq.students.q1"), a: t("faq.students.a1") },
    { q: t("faq.students.q2"), a: t("faq.students.a2") },
    { q: t("faq.students.q3"), a: t("faq.students.a3") },
    { q: t("faq.students.q4"), a: t("faq.students.a4") },
    { q: t("faq.students.q5"), a: t("faq.students.a5") },
    { q: t("faq.students.q6"), a: t("faq.students.a6") },
    { q: t("faq.students.q7"), a: t("faq.students.a7") },
  ];

  const instructorQuestions = [
    { q: t("faq.instructors.q1"), a: t("faq.instructors.a1") },
    { q: t("faq.instructors.q2"), a: t("faq.instructors.a2") },
    { q: t("faq.instructors.q3"), a: t("faq.instructors.a3") },
    { q: t("faq.instructors.q4"), a: t("faq.instructors.a4") },
    { q: t("faq.instructors.q5"), a: t("faq.instructors.a5") },
    { q: t("faq.instructors.q6"), a: t("faq.instructors.a6") },
  ];

  const generalQuestions = [
    { q: t("faq.general.q1"), a: t("faq.general.a1") },
    { q: t("faq.general.q2"), a: t("faq.general.a2") },
    { q: t("faq.general.q3"), a: t("faq.general.a3") },
    { q: t("faq.general.q4"), a: t("faq.general.a4") },
  ];

  const FAQSection = ({
    title,
    questions,
    idPrefix,
  }: {
    title: string;
    questions: { q: string; a: string }[];
    idPrefix: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {questions.map((item, index) => (
            <AccordionItem key={index} value={`${idPrefix}-${index}`}>
              <AccordionTrigger className="text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Preguntas frecuentes"
        description="Respuestas sobre cómo funciona Cognitio para estudiantes e instructores: compras, accesos, contenido y soporte."
        path="/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [...studentQuestions, ...instructorQuestions].map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />
      <main id="main" className="flex-1 container mx-auto px-4 py-8 max-w-4xl">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("faq.backHome")}
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("faq.title")}
          </h1>
          <p className="text-muted-foreground">{t("faq.subtitle")}</p>
        </div>

        <div className="space-y-6">
          <FAQSection
            title={t("faq.students.title")}
            questions={studentQuestions}
            idPrefix="student"
          />

          <FAQSection
            title={t("faq.instructors.title")}
            questions={instructorQuestions}
            idPrefix="instructor"
          />

          <FAQSection
            title={t("faq.general.title")}
            questions={generalQuestions}
            idPrefix="general"
          />

          {/* Contact section */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                {t("faq.contact.title")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("faq.contact.description")}
              </p>
              <a
                href="mailto:soporte@cognitio.lat"
                className="text-primary hover:underline font-medium"
              >
                soporte@cognitio.lat
              </a>
            </CardContent>
          </Card>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
