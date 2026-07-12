import type { Locale } from '../config';

export interface HomeFeatureCopy {
  title: string;
  description: string;
}

export interface HomeStatCopy {
  value: string;
  label: string;
}

export interface HomeAssistantCopy {
  name: string;
  status: string;
  greeting: string;
  example: string;
  understood: string;
  amount: string;
  category: string;
  merchant: string;
  date: string;
  today: string;
  confirm: string;
  placeholder: string;
}

export interface HomeAnalyticsCopy {
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  budget: string;
  savings: string;
  change: string;
  checks: string[];
}

export interface HomeDictionary {
  title: string;
  subtitle: string;
  description: string;
  startFree: string;
  viewDemo: string;
  login: string;
  navFeatures: string;
  navHow: string;
  navSecurity: string;
  eyebrow: string;
  heroAccent: string;
  heroSupport: string;
  heroBenefits: string[];
  heroUnderstood: string;
  scroll: string;
  balance: string;
  monthlyExpenses: string;
  savings: string;
  stats: HomeStatCopy[];
  productEyebrow: string;
  featureTitle: string;
  featureSubtitle: string;
  features: HomeFeatureCopy[];
  conversationEyebrow: string;
  conversationTitle: string;
  conversationSubtitle: string;
  conversationSteps: string[];
  assistant: HomeAssistantCopy;
  analytics: HomeAnalyticsCopy;
  securityTitle: string;
  securitySubtitle: string;
  securityItems: HomeFeatureCopy[];
  finalTitle: string;
  finalSubtitle: string;
  footerCopyright: string;
  footerPrivacy: string;
}

const homeDictionaries: Record<Locale, HomeDictionary> = {
  es: {
    title: 'Tu dinero, en equilibrio.',
    subtitle: 'Asistencia financiera inteligente',
    description: 'Controla tus finanzas personales con presupuestos dinámicos y explicaciones claras.',
    startFree: 'Comenzar gratis',
    viewDemo: 'Explorar la demo',
    login: 'Iniciar sesión',
    navFeatures: 'Producto',
    navHow: 'Cómo funciona',
    navSecurity: 'Seguridad',
    eyebrow: 'Tu bienestar financiero empieza aquí',
    heroAccent: 'Entiende, organiza y decide con inteligencia.',
    heroSupport: 'Registra gastos conversando, controla presupuestos y descubre patrones claros en un solo lugar.',
    heroBenefits: ['Sin tarjeta', 'Datos de demo incluidos', 'Control total'],
    heroUnderstood: 'Movimiento entendido',
    scroll: 'Descubre Kinti',
    balance: 'Saldo disponible',
    monthlyExpenses: 'Gastos este mes',
    savings: 'Tasa de ahorro',
    stats: [
      { value: '+2 min', label: 'para empezar' },
      { value: '3 formas', label: 'de registrar' },
      { value: '24/7', label: 'asistente disponible' },
      { value: '100%', label: 'bajo tu control' },
    ],
    productEyebrow: 'Lo esencial, conectado',
    featureTitle: 'Claridad para cada decisión.',
    featureSubtitle: 'Kinti convierte tus movimientos cotidianos en una experiencia financiera sencilla, visual y humana.',
    features: [
      { title: 'Registra conversando', description: 'Dile a Kinti “gasté 25 en comida”. Revisa los datos y confirma con tranquilidad.' },
      { title: 'Presupuestos vivos', description: 'Mira cuánto llevas, cuánto queda y recibe alertas antes de superar tus límites.' },
      { title: 'Insights comprensibles', description: 'Detecta patrones con gráficas claras y explicaciones que no necesitan conocimientos financieros.' },
    ],
    conversationEyebrow: 'Una conversación, no otro formulario',
    conversationTitle: 'Habla como siempre. Kinti organiza el resto.',
    conversationSubtitle: 'Escribe un gasto en lenguaje natural, revísalo y confirma. Sin formularios interminables.',
    conversationSteps: ['Escribe tu movimiento', 'Kinti identifica los detalles', 'Tú revisas y confirmas'],
    assistant: {
      name: 'Asistente Kinti', status: 'En línea · responde al instante', greeting: 'Hola, María. ¿Qué movimiento quieres registrar hoy?',
      example: 'Gasté $25 en comida en McDonald’s.', understood: 'Esto es lo que entendí', amount: 'Monto', category: 'Categoría',
      merchant: 'Comercio', date: 'Fecha', today: 'Hoy', confirm: 'Confirmar movimiento', placeholder: 'Escribe como lo harías normalmente…',
    },
    analytics: {
      eyebrow: 'Del dato a una decisión', title: 'Tus números cuentan una historia. Kinti te la explica.',
      description: 'Mira cómo cambian tus gastos, qué categorías crecen y cuánto puedes usar sin perder el equilibrio.',
      summary: 'Resumen mensual', budget: 'Presupuesto', savings: 'Ahorro', change: '+6 puntos este mes',
      checks: ['Alertas antes de superar tu límite', 'Comparaciones fáciles de entender', 'Datos conectados entre todas las vistas'],
    },
    securityTitle: 'Tus finanzas, privadas por diseño.',
    securitySubtitle: 'Controlas cada registro. Kinti explica antes de actuar y nunca ofrece recomendaciones de inversión irresponsables.',
    securityItems: [
      { title: 'Confirmación visible', description: 'Nada cambia sin que lo revises.' },
      { title: 'Acceso protegido', description: 'Tus datos permanecen bajo tu cuenta.' },
      { title: 'Importación controlada', description: 'Previsualiza antes de guardar archivos.' },
    ],
    finalTitle: 'Empieza hoy a sentir el control.',
    finalSubtitle: 'Entra a la demo con datos preparados o crea tu espacio personal cuando estés listo.',
    footerCopyright: '© 2026 Kinti · Tecnología para tu bienestar financiero.',
    footerPrivacy: 'Privacidad',
  },
  en: {
    title: 'Your money, in balance.',
    subtitle: 'Smart financial assistance',
    description: 'Control your personal finances with dynamic budgets and clear explanations.',
    startFree: 'Start free',
    viewDemo: 'Explore the demo',
    login: 'Sign in',
    navFeatures: 'Product',
    navHow: 'How it works',
    navSecurity: 'Security',
    eyebrow: 'Your financial wellbeing starts here',
    heroAccent: 'Understand, organize and decide with confidence.',
    heroSupport: 'Track expenses through conversation, control budgets and uncover clear patterns in one place.',
    heroBenefits: ['No card required', 'Demo data included', 'Complete control'],
    heroUnderstood: 'Transaction understood',
    scroll: 'Discover Kinti',
    balance: 'Available balance',
    monthlyExpenses: 'Expenses this month',
    savings: 'Savings rate',
    stats: [
      { value: '+2 min', label: 'to get started' },
      { value: '3 ways', label: 'to record' },
      { value: '24/7', label: 'assistant available' },
      { value: '100%', label: 'under your control' },
    ],
    productEyebrow: 'Everything essential, connected',
    featureTitle: 'Clarity for every decision.',
    featureSubtitle: 'Kinti turns everyday movements into a simple, visual and human financial experience.',
    features: [
      { title: 'Record through conversation', description: 'Tell Kinti “I spent 25 on food”. Review the details and confirm with confidence.' },
      { title: 'Living budgets', description: 'See what you have spent, what remains and receive alerts before crossing a limit.' },
      { title: 'Understandable insights', description: 'Spot patterns with clear charts and explanations that require no financial expertise.' },
    ],
    conversationEyebrow: 'A conversation, not another form',
    conversationTitle: 'Speak naturally. Kinti organizes the rest.',
    conversationSubtitle: 'Write an expense in natural language, review it and confirm. No endless forms.',
    conversationSteps: ['Write your transaction', 'Kinti identifies the details', 'You review and confirm'],
    assistant: {
      name: 'Kinti Assistant', status: 'Online · replies instantly', greeting: 'Hi, Maria. What transaction would you like to record?',
      example: 'I spent $25 on food at McDonald’s.', understood: 'Here is what I understood', amount: 'Amount', category: 'Category',
      merchant: 'Merchant', date: 'Date', today: 'Today', confirm: 'Confirm transaction', placeholder: 'Write as you normally would…',
    },
    analytics: {
      eyebrow: 'From data to a decision', title: 'Your numbers tell a story. Kinti explains it.',
      description: 'See how your spending changes, which categories grow and how much you can use while staying balanced.',
      summary: 'Monthly summary', budget: 'Budget', savings: 'Savings', change: '+6 points this month',
      checks: ['Alerts before crossing a limit', 'Comparisons that are easy to understand', 'Connected data across every view'],
    },
    securityTitle: 'Your finances, private by design.',
    securitySubtitle: 'You control every record. Kinti explains before acting and never gives reckless investment advice.',
    securityItems: [
      { title: 'Visible confirmation', description: 'Nothing changes before you review it.' },
      { title: 'Protected access', description: 'Your data stays under your account.' },
      { title: 'Controlled imports', description: 'Preview files before saving anything.' },
    ],
    finalTitle: 'Start feeling in control today.',
    finalSubtitle: 'Enter the prepared demo or create your personal space when you are ready.',
    footerCopyright: '© 2026 Kinti · Technology for your financial wellbeing.',
    footerPrivacy: 'Privacy',
  },
};

export function getHomeDictionary(locale: Locale): HomeDictionary {
  return homeDictionaries[locale];
}
