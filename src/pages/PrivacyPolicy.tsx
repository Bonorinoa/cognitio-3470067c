import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <main id="main" className="container max-w-4xl mx-auto py-12 px-4">
        {/* Back link */}
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <Card className="border-border bg-card">
          <CardHeader className="text-center border-b border-border pb-6">
            <CardTitle className="text-3xl font-bold text-foreground">
              Política de Privacidad
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Última actualización: 7 de Enero, 2026
            </p>
          </CardHeader>

          <CardContent className="prose prose-neutral dark:prose-invert max-w-none pt-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Introducción</h2>
              <p className="text-muted-foreground leading-relaxed">
                En Cognitio, valoramos y respetamos su privacidad. Esta Política de Privacidad describe 
                cómo recopilamos, usamos, almacenamos y protegemos su información personal cuando utiliza 
                nuestra plataforma educativa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Información que Recopilamos</h2>
              
              <h3 className="text-lg font-medium text-foreground mb-3">2.1 Información proporcionada directamente</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
                <li><strong className="text-foreground">Datos de cuenta:</strong> Nombre completo, dirección de correo electrónico, contraseña (encriptada)</li>
                <li><strong className="text-foreground">Perfil de instructor:</strong> Biografía, credenciales, afiliación institucional, foto de perfil, enlaces a redes sociales</li>
                <li><strong className="text-foreground">Contenido:</strong> Cursos, materiales educativos, documentos subidos a la base de conocimiento</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mb-3">2.2 Información recopilada automáticamente</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Datos de uso:</strong> Progreso en cursos, capítulos completados, interacciones con contenido</li>
                <li><strong className="text-foreground">Datos técnicos:</strong> Dirección IP, tipo de navegador, dispositivo, sistema operativo</li>
                <li><strong className="text-foreground">Generaciones IA:</strong> Historial de contenido generado con AI Studio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Cómo Utilizamos su Información</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Utilizamos su información para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Proporcionar y mantener el Servicio</li>
                <li>Procesar pagos y gestionar suscripciones</li>
                <li>Personalizar su experiencia de aprendizaje</li>
                <li>Generar contenido con IA basado en sus documentos y preferencias</li>
                <li>Enviar comunicaciones importantes sobre su cuenta</li>
                <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
                <li>Proporcionar soporte técnico</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Base Legal para el Procesamiento</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  <strong className="text-foreground">Ejecución de contrato:</strong> Procesamos datos necesarios 
                  para proporcionar el Servicio que usted ha solicitado.
                </p>
                <p>
                  <strong className="text-foreground">Consentimiento:</strong> Para ciertas actividades como 
                  comunicaciones de marketing, solicitamos su consentimiento explícito.
                </p>
                <p>
                  <strong className="text-foreground">Interés legítimo:</strong> Para mejorar nuestros servicios 
                  y prevenir fraude.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Compartición de Datos</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                No vendemos su información personal. Compartimos datos solo en las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Proveedores de servicios:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>Supabase (base de datos y autenticación)</li>
                    <li>Stripe (procesamiento de pagos)</li>
                    <li>Mux (hosting de video)</li>
                    <li>Google AI (generación de contenido)</li>
                  </ul>
                </li>
                <li><strong className="text-foreground">Requerimientos legales:</strong> Cuando sea requerido por ley o proceso legal válido</li>
                <li><strong className="text-foreground">Protección de derechos:</strong> Para proteger los derechos, propiedad o seguridad de Cognitio y sus usuarios</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Seguridad de Datos</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Implementamos medidas de seguridad técnicas y organizativas:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Encriptación de datos en tránsito (TLS/HTTPS)</li>
                <li>Contraseñas hasheadas con algoritmos seguros</li>
                <li>Políticas de seguridad a nivel de base de datos (Row Level Security)</li>
                <li>Acceso restringido a datos personales</li>
                <li>Auditorías de seguridad regulares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Retención de Datos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Conservamos su información mientras su cuenta esté activa o según sea necesario para 
                proporcionar servicios. Al eliminar su cuenta, eliminamos o anonimizamos sus datos 
                personales en un plazo de 30 días, excepto cuando sea necesario retenerlos por 
                obligaciones legales o para resolver disputas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Sus Derechos</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Acceso:</strong> Solicitar una copia de sus datos personales</li>
                <li><strong className="text-foreground">Rectificación:</strong> Corregir datos inexactos desde su perfil</li>
                <li><strong className="text-foreground">Eliminación:</strong> Solicitar la eliminación de su cuenta y datos</li>
                <li><strong className="text-foreground">Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong className="text-foreground">Oposición:</strong> Oponerse al procesamiento para marketing directo</li>
                <li><strong className="text-foreground">Retiro de consentimiento:</strong> Retirar consentimiento en cualquier momento</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Para ejercer estos derechos, contacte a{" "}
                <a href="mailto:agbonorino21@gmail.com" className="text-primary hover:underline">
                  agbonorino21@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">9. Uso de IA y Contenido Generado</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  <strong className="text-foreground">9.1 Procesamiento:</strong> Cuando utiliza AI Studio, sus 
                  documentos y preferencias de estilo se envían a servicios de IA (Google Gemini) para 
                  generar contenido.
                </p>
                <p>
                  <strong className="text-foreground">9.2 Almacenamiento:</strong> El historial de generaciones se 
                  almacena en su cuenta para referencia futura, con un límite de 10 items activos.
                </p>
                <p>
                  <strong className="text-foreground">9.3 Propiedad:</strong> El contenido generado le pertenece. 
                  No utilizamos su contenido generado para entrenar modelos de IA.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">10. Cookies y Tecnologías Similares</h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos cookies esenciales para el funcionamiento del Servicio, incluyendo autenticación 
                y preferencias de sesión. No utilizamos cookies de seguimiento de terceros ni publicidad 
                basada en comportamiento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">11. Menores de Edad</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cognitio no está dirigido a menores de 16 años. No recopilamos intencionalmente información 
                de menores. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos de 
                inmediato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">12. Transferencias Internacionales</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sus datos pueden ser procesados en servidores ubicados fuera de su país. Nuestros 
                proveedores de servicios (Supabase, Stripe, Mux) mantienen estándares de protección 
                de datos adecuados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">13. Cambios a esta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos actualizar esta Política de Privacidad periódicamente. Los cambios significativos 
                serán notificados por correo electrónico o mediante un aviso destacado en la plataforma. 
                La fecha de "última actualización" al inicio indica cuándo se realizaron los últimos cambios.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">14. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para preguntas sobre esta Política de Privacidad o para ejercer sus derechos, contacte a:{" "}
                <a href="mailto:agbonorino21@gmail.com" className="text-primary hover:underline">
                  agbonorino21@gmail.com
                </a>
              </p>
            </section>

            <div className="border-t border-border pt-8 mt-8">
              <p className="text-sm text-muted-foreground text-center">
                © 2026 Cognitio. Todos los derechos reservados.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
