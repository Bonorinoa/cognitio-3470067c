import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
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
              Términos de Servicio
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Última actualización: 7 de Enero, 2026
            </p>
          </CardHeader>

          <CardContent className="prose prose-neutral dark:prose-invert max-w-none pt-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Aceptación de los Términos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Al acceder y utilizar la plataforma Cognitio ("el Servicio"), usted acepta estar sujeto a estos 
                Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá 
                acceder al Servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Descripción del Servicio</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cognitio es una plataforma educativa por invitación que permite a instructores curados 
                crear y vender cursos en línea, ofrecer servicios de consultoría, y utilizar herramientas 
                de inteligencia artificial para la generación de contenido. Los estudiantes pueden comprar 
                cursos, acceder a materiales educativos y participar en discusiones.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Cuentas de Usuario</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  <strong className="text-foreground">3.1 Registro:</strong> Para utilizar ciertas funciones del Servicio, 
                  debe crear una cuenta proporcionando información precisa y completa.
                </p>
                <p>
                  <strong className="text-foreground">3.2 Seguridad:</strong> Usted es responsable de mantener la 
                  confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.
                </p>
                <p>
                  <strong className="text-foreground">3.3 Roles:</strong> El rol de "Instructor" es otorgado exclusivamente 
                  por administradores de la plataforma. No existe un proceso de registro público para instructores.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Compras y Pagos</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  <strong className="text-foreground">4.1 Precios:</strong> Todos los precios se muestran en la moneda 
                  indicada y pueden estar sujetos a impuestos aplicables.
                </p>
                <p>
                  <strong className="text-foreground">4.2 Procesamiento:</strong> Los pagos son procesados de forma segura 
                  a través de Stripe. No almacenamos información de tarjetas de crédito.
                </p>
                <p>
                  <strong className="text-foreground">4.3 Acceso:</strong> Una vez completada la compra, tendrá acceso 
                  inmediato al contenido del curso adquirido.
                </p>
                <p>
                  <strong className="text-foreground">4.4 Reembolsos:</strong> Las solicitudes de reembolso serán evaluadas 
                  caso por caso. Contacte a soporte dentro de los 14 días posteriores a la compra.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Suscripciones AI Studio</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  <strong className="text-foreground">5.1 Planes:</strong> AI Studio ofrece planes de suscripción 
                  (Marketing, Academic, Pro) con diferentes límites de generación de contenido.
                </p>
                <p>
                  <strong className="text-foreground">5.2 Facturación:</strong> Las suscripciones se facturan mensualmente. 
                  Puede cancelar en cualquier momento y mantendrá acceso hasta el final del período pagado.
                </p>
                <p>
                  <strong className="text-foreground">5.3 Límites:</strong> Los límites de uso se reinician diariamente. 
                  El contenido generado no utilizado no se acumula.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Contenido del Usuario</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>
                  <strong className="text-foreground">6.1 Propiedad:</strong> Los instructores mantienen la propiedad 
                  de todo el contenido original que suben a la plataforma.
                </p>
                <p>
                  <strong className="text-foreground">6.2 Licencia:</strong> Al subir contenido, otorga a Cognitio una 
                  licencia no exclusiva para mostrar, distribuir y promocionar dicho contenido dentro de la plataforma.
                </p>
                <p>
                  <strong className="text-foreground">6.3 Contenido generado por IA:</strong> El contenido creado usando 
                  las herramientas de AI Studio pertenece al usuario que lo generó.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Conducta Prohibida</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Está prohibido:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Compartir credenciales de acceso con terceros</li>
                <li>Redistribuir contenido de cursos sin autorización</li>
                <li>Utilizar el Servicio para actividades ilegales</li>
                <li>Intentar acceder a cuentas o datos de otros usuarios</li>
                <li>Subir contenido ofensivo, difamatorio o que infrinja derechos de autor</li>
                <li>Utilizar bots o herramientas automatizadas no autorizadas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Propiedad Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                La plataforma Cognitio, incluyendo su diseño, código, logos y funcionalidades, es propiedad 
                de los fundadores de Cognitio. Queda prohibida la reproducción, modificación o distribución 
                sin autorización expresa por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">9. Limitación de Responsabilidad</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cognitio se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables 
                de pérdidas o daños derivados del uso del Servicio, interrupciones del servicio, o errores 
                en el contenido generado por IA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">10. Modificaciones</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios 
                significativos serán notificados por correo electrónico. El uso continuado del Servicio 
                después de dichas modificaciones constituye su aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">11. Terminación</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos suspender o terminar su cuenta si viola estos términos. Usted puede eliminar su 
                cuenta en cualquier momento desde la configuración de usuario. Al eliminar su cuenta, 
                perderá acceso a todo el contenido y cursos adquiridos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">12. Ley Aplicable</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estos términos se rigen por las leyes aplicables. Cualquier disputa será resuelta mediante 
                negociación de buena fe o, si es necesario, mediante arbitraje.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">13. Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para preguntas sobre estos Términos de Servicio, puede contactarnos en:{" "}
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
      </main>
    </div>
  );
};

export default TermsOfService;
