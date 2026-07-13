import type { Locale } from '../config';

export type LegalDocumentKind = 'terms' | 'privacy';

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
}

export interface LegalDocumentCopy {
  eyebrow: string;
  title: string;
  summary: string;
  effectiveLabel: string;
  effectiveDate: string;
  contents: string;
  backHome: string;
  switchLanguage: string;
  otherDocument: string;
  contactTitle: string;
  contactText: string;
  supportLabel: string;
  telegramLabel: string;
  sections: LegalSection[];
}

const terms: Record<Locale, LegalDocumentCopy> = {
  es: {
    eyebrow: 'Documento legal',
    title: 'Términos y condiciones',
    summary:
      'Estas reglas explican cómo puedes utilizar Kinti y qué puedes esperar del servicio. Buscamos que sean claras, razonables y fáciles de consultar.',
    effectiveLabel: 'Vigentes desde',
    effectiveDate: '13 de julio de 2026',
    contents: 'Contenido',
    backHome: 'Volver al inicio',
    switchLanguage: 'Read in English',
    otherDocument: 'Consultar Política de privacidad',
    contactTitle: '¿Tienes preguntas sobre estos términos?',
    contactText:
      'Puedes comunicarte mediante el centro de soporte de Kinti o a través del bot oficial. No utilizamos direcciones de correo ficticias como canal de contacto.',
    supportLabel: 'Ir al centro de soporte',
    telegramLabel: 'Abrir @kintiAsesor_bot',
    sections: [
      {
        id: 'aceptacion',
        title: '1. Aceptación y alcance',
        paragraphs: [
          'Al crear una cuenta, iniciar sesión o utilizar Kinti aceptas estos Términos y nuestra Política de privacidad. Si no estás de acuerdo, no debes usar el servicio.',
          'Kinti es una herramienta de organización de finanzas personales. Permite registrar movimientos, crear presupuestos, visualizar indicadores, recibir alertas, importar información, conversar con un asistente automatizado y solicitar soporte.',
        ],
      },
      {
        id: 'cuenta',
        title: '2. Cuenta y acceso',
        paragraphs: [
          'Debes proporcionar datos correctos, mantener tus credenciales protegidas y avisarnos mediante soporte si detectas un acceso no autorizado. La cuenta es personal y no debes compartir contraseñas ni códigos de verificación.',
          'Puedes acceder mediante correo y contraseña o, cuando esté disponible, mediante Google/Firebase. Los códigos de verificación y recuperación tienen vigencia limitada y son de un solo uso.',
        ],
        bullets: [
          'Debes tener capacidad legal para aceptar estos Términos o contar con autorización de tu representante legal.',
          'No puedes crear cuentas para suplantar a otra persona ni utilizar información financiera ajena sin autorización.',
          'Eres responsable de revisar la información antes de confirmar una transacción, presupuesto o importación.',
        ],
      },
      {
        id: 'funcionamiento',
        title: '3. Funcionamiento del servicio',
        paragraphs: [
          'Los saldos, comparaciones, presupuestos e indicadores se calculan a partir de la información registrada en tu cuenta. La exactitud de los resultados depende de que los montos, categorías y fechas sean correctos y estén completos.',
          'Kinti puede cambiar, mejorar, suspender o retirar funciones para mantener la seguridad, cumplir requisitos técnicos o evolucionar el producto. Procuraremos evitar interrupciones innecesarias, pero no garantizamos disponibilidad ininterrumpida.',
        ],
      },
      {
        id: 'inteligencia-artificial',
        title: '4. Asistente e inteligencia artificial',
        paragraphs: [
          'El asistente puede interpretar mensajes o archivos y proponer movimientos, presupuestos, respuestas o acciones. Las respuestas automatizadas pueden contener errores, omisiones o interpretaciones imprecisas.',
          'Debes revisar el resultado antes de tomar decisiones. Kinti no sustituye asesoría profesional contable, tributaria, jurídica o financiera y no garantiza rendimientos, ahorros ni resultados económicos.',
        ],
        note: 'No compartas contraseñas, códigos de acceso, números completos de tarjetas ni otra información secreta en el asistente o en tickets de soporte.',
      },
      {
        id: 'uso-permitido',
        title: '5. Uso permitido',
        paragraphs: ['Te comprometes a utilizar Kinti de forma legal y respetuosa. No está permitido:'],
        bullets: [
          'Intentar acceder a cuentas, datos, sistemas o integraciones sin autorización.',
          'Introducir código malicioso, saturar el servicio o interferir con su funcionamiento.',
          'Usar webhooks, importaciones o automatizaciones para falsificar información o eludir controles de seguridad.',
          'Copiar, revender o explotar comercialmente el servicio sin autorización.',
        ],
      },
      {
        id: 'integraciones',
        title: '6. Integraciones y servicios externos',
        paragraphs: [
          'Kinti puede conectarse con servicios como Google/Firebase, Telegram e infraestructura de automatización. El uso de esos servicios también puede estar sujeto a sus propios términos y políticas.',
          'Abrir el bot de Telegram es voluntario. El simple enlace al bot no transfiere automáticamente los datos de tu cuenta; cualquier interacción posterior dentro de Telegram depende de las acciones que realices allí.',
        ],
      },
      {
        id: 'propiedad',
        title: '7. Contenido y propiedad intelectual',
        paragraphs: [
          'Conservas la titularidad de los datos que registras. Nos autorizas a procesarlos únicamente para prestar, proteger y mejorar las funciones que solicitas, conforme a la Política de privacidad.',
          'El diseño, software, identidad visual, textos propios y componentes de Kinti están protegidos por las normas aplicables. Estos Términos no te transfieren derechos sobre la plataforma.',
        ],
      },
      {
        id: 'cancelacion',
        title: '8. Suspensión y eliminación',
        paragraphs: [
          'Puedes dejar de usar Kinti o solicitar la eliminación de tu cuenta desde Configuración. La eliminación comprende los datos asociados a la cuenta activa, sin perjuicio de copias temporales de seguridad o registros mínimos que debamos conservar por seguridad o cumplimiento.',
          'Podemos limitar o suspender el acceso cuando exista un riesgo de seguridad, uso abusivo, incumplimiento de estos Términos o una obligación legal. Cuando sea razonable, informaremos la causa y las opciones disponibles.',
        ],
      },
      {
        id: 'responsabilidad',
        title: '9. Responsabilidad',
        paragraphs: [
          'Kinti se ofrece como herramienta de apoyo informativo. No somos un banco, una entidad de inversión ni un custodio de fondos. No movemos dinero ni ejecutamos operaciones bancarias por tu cuenta.',
          'En la medida permitida por la ley, no respondemos por decisiones tomadas exclusivamente con base en estimaciones, información incompleta, errores ingresados por el usuario o indisponibilidad de servicios externos. Nada de lo indicado limita derechos irrenunciables del consumidor.',
        ],
      },
      {
        id: 'cambios',
        title: '10. Cambios y contacto',
        paragraphs: [
          'Podemos actualizar estos Términos para reflejar cambios del producto, seguridad o normativa. Publicaremos la versión vigente y su fecha. Si el cambio es material, procuraremos informarlo dentro del servicio antes de que entre en vigor.',
          'Las consultas, solicitudes o desacuerdos pueden presentarse primero por los canales de soporte indicados al final de esta página. Se aplicarán las normas obligatorias de protección al consumidor y la jurisdicción que corresponda según la relación con cada usuario.',
        ],
      },
    ],
  },
  en: {
    eyebrow: 'Legal document',
    title: 'Terms and conditions',
    summary:
      'These rules explain how you may use Kinti and what you can expect from the service. We have written them to be clear, reasonable, and easy to consult.',
    effectiveLabel: 'Effective from',
    effectiveDate: 'July 13, 2026',
    contents: 'Contents',
    backHome: 'Back to home',
    switchLanguage: 'Leer en español',
    otherDocument: 'Read the Privacy Policy',
    contactTitle: 'Questions about these terms?',
    contactText:
      'Contact us through Kinti’s support center or the official bot. We do not list fictional email addresses as contact channels.',
    supportLabel: 'Go to support center',
    telegramLabel: 'Open @kintiAsesor_bot',
    sections: [
      {
        id: 'acceptance',
        title: '1. Acceptance and scope',
        paragraphs: [
          'By creating an account, signing in, or using Kinti, you agree to these Terms and our Privacy Policy. If you disagree, you must not use the service.',
          'Kinti is a personal finance organization tool. It supports transaction tracking, budgets, indicators, alerts, imports, automated assistance, and support requests.',
        ],
      },
      {
        id: 'account',
        title: '2. Account and access',
        paragraphs: [
          'You must provide accurate information, protect your credentials, and contact support if you detect unauthorized access. Your account is personal; never share passwords or verification codes.',
          'You may sign in with email and password or, when available, Google/Firebase. Verification and recovery codes are time-limited and single-use.',
        ],
        bullets: [
          'You must have legal capacity to accept these Terms or permission from your legal representative.',
          'You may not impersonate others or use someone else’s financial information without authorization.',
          'You are responsible for reviewing information before confirming a transaction, budget, or import.',
        ],
      },
      {
        id: 'operation',
        title: '3. How the service works',
        paragraphs: [
          'Balances, comparisons, budgets, and indicators are calculated from the information in your account. Their accuracy depends on complete and correct amounts, categories, and dates.',
          'Kinti may change, improve, suspend, or remove features for security, technical, or product reasons. We aim to avoid unnecessary disruption but cannot promise uninterrupted availability.',
        ],
      },
      {
        id: 'artificial-intelligence',
        title: '4. Assistant and artificial intelligence',
        paragraphs: [
          'The assistant may interpret messages or files and suggest transactions, budgets, responses, or actions. Automated responses may contain errors, omissions, or inaccurate interpretations.',
          'Review every result before acting. Kinti does not replace professional accounting, tax, legal, or financial advice and does not guarantee returns, savings, or economic outcomes.',
        ],
        note: 'Never share passwords, access codes, full card numbers, or other secrets through the assistant or support tickets.',
      },
      {
        id: 'acceptable-use',
        title: '5. Acceptable use',
        paragraphs: ['You agree to use Kinti lawfully and respectfully. You must not:'],
        bullets: [
          'Access accounts, data, systems, or integrations without authorization.',
          'Introduce malicious code, overload the service, or interfere with its operation.',
          'Use webhooks, imports, or automation to falsify information or bypass security controls.',
          'Copy, resell, or commercially exploit the service without authorization.',
        ],
      },
      {
        id: 'integrations',
        title: '6. Integrations and external services',
        paragraphs: [
          'Kinti may connect to services such as Google/Firebase, Telegram, and automation infrastructure. Those services may also have their own terms and policies.',
          'Opening the Telegram bot is voluntary. Following the link does not automatically transfer your Kinti account data; later interactions in Telegram depend on the actions you take there.',
        ],
      },
      {
        id: 'ownership',
        title: '7. Content and intellectual property',
        paragraphs: [
          'You retain ownership of the data you enter. You authorize us to process it only to provide, protect, and improve requested features, as described in the Privacy Policy.',
          'Kinti’s software, visual identity, original text, and components are protected under applicable law. These Terms do not transfer ownership of the platform to you.',
        ],
      },
      {
        id: 'termination',
        title: '8. Suspension and deletion',
        paragraphs: [
          'You may stop using Kinti or request account deletion in Settings. Deletion covers data associated with the active account, subject to temporary backups or minimum records required for security or compliance.',
          'We may restrict access in response to security risks, abuse, a breach of these Terms, or a legal obligation. When reasonable, we will explain the reason and available options.',
        ],
      },
      {
        id: 'liability',
        title: '9. Responsibility',
        paragraphs: [
          'Kinti is an informational support tool. We are not a bank, investment entity, or custodian of funds. We do not move money or execute banking transactions on your behalf.',
          'To the extent allowed by law, we are not responsible for decisions based solely on estimates, incomplete data, user input errors, or unavailable third-party services. This does not limit mandatory consumer rights.',
        ],
      },
      {
        id: 'changes',
        title: '10. Changes and contact',
        paragraphs: [
          'We may update these Terms to reflect product, security, or legal changes. We will publish the current version and effective date and aim to provide notice before material changes take effect.',
          'Questions, requests, or disputes may first be submitted through the support channels at the end of this page. Mandatory consumer protection rules and the jurisdiction applicable to each user relationship remain in force.',
        ],
      },
    ],
  },
};

const privacy: Record<Locale, LegalDocumentCopy> = {
  es: {
    eyebrow: 'Tu información, explicada con claridad',
    title: 'Política de privacidad',
    summary:
      'Esta política describe qué información utiliza Kinti, para qué la necesita, cuándo intervienen otros servicios y qué controles tienes sobre tus datos.',
    effectiveLabel: 'Vigente desde',
    effectiveDate: '13 de julio de 2026',
    contents: 'Contenido',
    backHome: 'Volver al inicio',
    switchLanguage: 'Read in English',
    otherDocument: 'Consultar Términos y condiciones',
    contactTitle: 'Privacidad bajo tu control',
    contactText:
      'Puedes solicitar acceso, corrección, exportación o eliminación desde Kinti y comunicar cualquier duda mediante soporte o el bot oficial.',
    supportLabel: 'Gestionar desde soporte',
    telegramLabel: 'Abrir @kintiAsesor_bot',
    sections: [
      {
        id: 'responsable',
        title: '1. Alcance y responsable',
        paragraphs: [
          'Esta Política se aplica al sitio, aplicación, API y funciones de Kinti. El servicio Kinti es responsable del tratamiento que realiza directamente para operar las cuentas y funciones descritas aquí.',
          'Los servicios externos que elijas utilizar, como Google o Telegram, pueden tratar información bajo sus propias políticas. Kinti no controla el tratamiento independiente que esas plataformas realizan fuera de nuestro servicio.',
        ],
      },
      {
        id: 'datos',
        title: '2. Información que tratamos',
        paragraphs: ['Tratamos únicamente las categorías de datos necesarias para ofrecer las funciones que utilizas:'],
        bullets: [
          'Cuenta e identidad: nombre, correo, estado de verificación, credenciales protegidas y datos técnicos de sesión.',
          'Perfil y preferencias: teléfono opcional, moneda, apariencia y preferencias de alertas.',
          'Finanzas personales: movimientos, montos, fechas, categorías, comercios, descripciones, presupuestos y alertas.',
          'Asistente: mensajes, nombre del archivo que decidas adjuntar, solicitudes, respuestas y movimientos asociados.',
          'Soporte: asunto, prioridad, contexto, mensajes e historial de tickets.',
          'Seguridad: tokens revocados, intentos y tokens protegidos de verificación o recuperación.',
        ],
      },
      {
        id: 'telefono-correo',
        title: '3. Teléfono y correo electrónico',
        paragraphs: [
          'El número de teléfono es opcional. Se guarda como parte de tu perfil para conservar tu preferencia de contacto y facilitar integraciones futuras con Telegram cuando tú decidas utilizarlas. No lo vendemos, no lo usamos para publicidad y no realizamos llamadas o mensajes promocionales sin tu autorización.',
          'El correo se utiliza para identificar tu cuenta, verificar el registro, iniciar sesión, recuperar el acceso y enviarte comunicaciones necesarias sobre seguridad o funcionamiento. No utilizamos tu correo para campañas promocionales salvo que exista una autorización separada y revocable.',
        ],
        note: 'Nunca solicitaremos por correo, teléfono o Telegram tu contraseña, un código de acceso vigente ni los datos completos de una tarjeta.',
      },
      {
        id: 'finalidades',
        title: '4. Para qué usamos la información',
        paragraphs: ['Utilizamos los datos para finalidades concretas vinculadas al servicio:'],
        bullets: [
          'Crear y proteger la cuenta, autenticar sesiones y recuperar el acceso.',
          'Registrar, ordenar y mostrar movimientos, presupuestos, balances, comparaciones y alertas.',
          'Procesar importaciones y solicitudes del asistente que hayas iniciado.',
          'Responder tickets, investigar errores, prevenir abuso y mantener la seguridad.',
          'Cumplir obligaciones aplicables y ejercer o defender derechos cuando sea necesario.',
        ],
      },
      {
        id: 'automatizacion',
        title: '5. Automatización e inteligencia artificial',
        paragraphs: [
          'Cuando utilizas el asistente, enviamos el identificador de la solicitud, tu identificador interno, el mensaje y el archivo opcional a la infraestructura de automatización configurada por Kinti. Conservamos el estado y la respuesta para mostrar el historial y actualizar las funciones relacionadas.',
          'La automatización se activa por tu solicitud. No debes incluir secretos ni información de terceros que no estés autorizado a compartir. Los movimientos generados por IA se asocian únicamente a tu cuenta y pasan por los controles del backend.',
        ],
      },
      {
        id: 'terceros',
        title: '6. Proveedores e integraciones',
        paragraphs: [
          'Podemos utilizar proveedores de base de datos, alojamiento, correo transaccional, autenticación y automatización. Estos proveedores reciben solamente la información necesaria para prestar su función y deben aplicar medidas de seguridad y confidencialidad acordes con el servicio.',
          'Si eliges iniciar sesión con Google/Firebase, recibimos la información básica necesaria para autenticarte. Si abres Telegram, la interacción ocurre también bajo las reglas de Telegram; seguir el enlace no entrega automáticamente tu base financiera a esa plataforma.',
        ],
        note: 'Kinti no vende ni alquila datos personales y no utiliza información financiera para crear perfiles publicitarios de terceros.',
      },
      {
        id: 'almacenamiento',
        title: '7. Conservación y eliminación',
        paragraphs: [
          'Conservamos la información mientras tu cuenta esté activa y durante el tiempo estrictamente necesario para prestar el servicio, resolver incidencias, mantener seguridad y cumplir obligaciones aplicables.',
          'Al eliminar la cuenta se eliminan los datos asociados en la base activa. Algunas copias de seguridad o registros técnicos mínimos pueden permanecer temporalmente hasta completar sus ciclos de eliminación o atender obligaciones legítimas. Los códigos y tokens de recuperación expiran y no se guardan en texto legible.',
        ],
      },
      {
        id: 'seguridad',
        title: '8. Seguridad',
        paragraphs: [
          'Aplicamos aislamiento por usuario, validación de entradas, autenticación mediante tokens, revocación de sesión y protección de códigos y contraseñas. Los webhooks sensibles requieren un secreto y las rutas privadas requieren autenticación.',
          'Ningún sistema es completamente infalible. Si detectamos un incidente relevante, actuaremos para contenerlo y comunicaremos la información exigida por las normas aplicables.',
        ],
      },
      {
        id: 'almacenamiento-local',
        title: '9. Datos en tu navegador',
        paragraphs: [
          'Kinti utiliza almacenamiento local del navegador para mantener la sesión, recordar preferencias visuales y completar flujos solicitados, como la recuperación de acceso. Estos mecanismos son necesarios para el funcionamiento de la aplicación.',
          'Actualmente Kinti no utiliza esos datos para publicidad comportamental. Puedes borrar el almacenamiento desde tu navegador, aunque esto puede cerrar la sesión o restablecer preferencias.',
        ],
      },
      {
        id: 'derechos',
        title: '10. Tus derechos y opciones',
        paragraphs: [
          'Puedes consultar y corregir tu perfil, cambiar preferencias, exportar información y solicitar la eliminación de tu cuenta desde Configuración. También puedes solicitar acceso, rectificación, oposición o limitación cuando estos derechos correspondan según la normativa aplicable.',
          'Para consultas o solicitudes utiliza el centro de soporte dentro de Kinti o el bot oficial indicado al final. Antes de entregar información o ejecutar una solicitud sensible podremos verificar tu identidad para proteger la cuenta.',
        ],
      },
      {
        id: 'cambios-privacidad',
        title: '11. Cambios a esta política',
        paragraphs: [
          'Podemos actualizar esta Política cuando cambien las funciones, proveedores o requisitos legales. La versión publicada mostrará su fecha de vigencia. Si un cambio afecta materialmente el uso de tus datos, procuraremos informarlo dentro del servicio antes de aplicarlo.',
        ],
      },
    ],
  },
  en: {
    eyebrow: 'Your information, clearly explained',
    title: 'Privacy policy',
    summary:
      'This policy explains what information Kinti uses, why it is needed, when other services are involved, and which controls you have over your data.',
    effectiveLabel: 'Effective from',
    effectiveDate: 'July 13, 2026',
    contents: 'Contents',
    backHome: 'Back to home',
    switchLanguage: 'Leer en español',
    otherDocument: 'Read the Terms and conditions',
    contactTitle: 'Privacy under your control',
    contactText:
      'You can request access, correction, export, or deletion through Kinti and contact us through support or the official bot.',
    supportLabel: 'Manage through support',
    telegramLabel: 'Open @kintiAsesor_bot',
    sections: [
      {
        id: 'controller',
        title: '1. Scope and controller',
        paragraphs: [
          'This Policy applies to Kinti’s website, application, API, and features. The Kinti service is responsible for processing carried out directly to operate the accounts and features described here.',
          'External services you choose to use, such as Google or Telegram, may process information under their own policies. Kinti does not control their independent processing outside our service.',
        ],
      },
      {
        id: 'data',
        title: '2. Information we process',
        paragraphs: ['We process only the categories needed to provide the features you use:'],
        bullets: [
          'Account and identity: name, email, verification status, protected credentials, and technical session data.',
          'Profile and preferences: optional phone number, currency, appearance, and alert preferences.',
          'Personal finance: transactions, amounts, dates, categories, merchants, descriptions, budgets, and alerts.',
          'Assistant: messages, the name of an optional attached file, requests, responses, and associated transactions.',
          'Support: ticket subject, priority, context, messages, and history.',
          'Security: revoked tokens, attempts, and protected verification or recovery tokens.',
        ],
      },
      {
        id: 'phone-email',
        title: '3. Phone number and email',
        paragraphs: [
          'Your phone number is optional. It is stored as part of your profile to retain your contact preference and support future Telegram integrations when you choose to use them. We do not sell it, use it for advertising, or make promotional calls or messages without your permission.',
          'Your email identifies the account, supports registration verification, sign-in, access recovery, and necessary security or service communications. We do not use it for promotional campaigns unless you provide separate, revocable consent.',
        ],
        note: 'We will never request your password, an active access code, or full card details by email, phone, or Telegram.',
      },
      {
        id: 'purposes',
        title: '4. Why we use information',
        paragraphs: ['We use data for specific purposes related to the service:'],
        bullets: [
          'Create and protect accounts, authenticate sessions, and recover access.',
          'Record and display transactions, budgets, balances, comparisons, and alerts.',
          'Process imports and assistant requests initiated by you.',
          'Respond to tickets, investigate errors, prevent abuse, and maintain security.',
          'Meet applicable obligations and establish or defend rights when necessary.',
        ],
      },
      {
        id: 'automation',
        title: '5. Automation and artificial intelligence',
        paragraphs: [
          'When you use the assistant, we send the request ID, your internal user ID, the message, and any optional file to Kinti’s configured automation infrastructure. We retain status and response data to show history and refresh related features.',
          'Automation runs at your request. Do not include secrets or third-party information you are not authorized to share. AI-generated transactions remain associated only with your account and pass through backend controls.',
        ],
      },
      {
        id: 'providers',
        title: '6. Providers and integrations',
        paragraphs: [
          'We may use database, hosting, transactional email, authentication, and automation providers. They receive only the information needed to perform their role and must apply safeguards appropriate to the service.',
          'If you sign in with Google/Firebase, we receive the basic information needed to authenticate you. If you open Telegram, that interaction is also governed by Telegram’s rules; following the link does not automatically send your financial database to Telegram.',
        ],
        note: 'Kinti does not sell or rent personal data and does not use financial information to build third-party advertising profiles.',
      },
      {
        id: 'retention',
        title: '7. Retention and deletion',
        paragraphs: [
          'We retain information while your account is active and for the time strictly needed to provide the service, resolve issues, maintain security, and meet applicable obligations.',
          'Deleting an account removes associated data from the active database. Some backups or minimum technical records may remain temporarily until deletion cycles finish or legitimate obligations are met. Recovery codes and tokens expire and are not stored as readable text.',
        ],
      },
      {
        id: 'security',
        title: '8. Security',
        paragraphs: [
          'We use per-user isolation, input validation, token authentication, session revocation, and protected codes and passwords. Sensitive webhooks require a secret, and private routes require authentication.',
          'No system is completely infallible. If we identify a relevant incident, we will act to contain it and provide notices required under applicable law.',
        ],
      },
      {
        id: 'browser-storage',
        title: '9. Data in your browser',
        paragraphs: [
          'Kinti uses local browser storage to maintain sessions, remember visual preferences, and complete requested flows such as access recovery. These mechanisms are necessary for the application to work.',
          'Kinti does not currently use this data for behavioral advertising. You may clear browser storage, although this may sign you out or reset preferences.',
        ],
      },
      {
        id: 'rights',
        title: '10. Your rights and choices',
        paragraphs: [
          'You can review and correct your profile, change preferences, export information, and request account deletion in Settings. You may also request access, correction, objection, or restriction where these rights apply under relevant law.',
          'Use Kinti’s support center or the official bot listed below for requests. We may verify your identity before disclosing information or completing a sensitive request to protect the account.',
        ],
      },
      {
        id: 'privacy-changes',
        title: '11. Changes to this policy',
        paragraphs: [
          'We may update this Policy when features, providers, or legal requirements change. The published version will show its effective date. If a change materially affects how data is used, we aim to notify you within the service before it applies.',
        ],
      },
    ],
  },
};

export function getLegalDocumentCopy(
  locale: Locale,
  kind: LegalDocumentKind,
): LegalDocumentCopy {
  return kind === 'terms' ? terms[locale] : privacy[locale];
}
