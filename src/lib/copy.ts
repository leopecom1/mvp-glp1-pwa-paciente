export const DISCLAIMER =
  "Esta aplicación facilita el registro y la comunicación. No diagnostica, no prescribe y no reemplaza la consulta médica ni la información oficial del medicamento.";

export const COPY = {
  appName: "Kodevant",
  appShortName: "Paciente",
  invitationEyebrow: "Invitación",
  joinTitle: (clinicName: string) => `Unirte a ${clinicName}`,
  joinLead:
    "Te invitaron a acompañar tu tratamiento. Aquí registrarás tus dosis, cómo te sientes y tu peso, con calma y a tu ritmo.",
  consentEyebrow: "Consentimiento",
  consentTypeChip: "tratamiento_datos",
  consentCheckbox:
    "He leído y acepto el consentimiento de tratamiento de datos de salud.",
  acceptCta: "Continuar",
  accepting: "Uniendo…",
  needEmailLink:
    "Para unirte, abre el enlace o el código que te enviaron por correo. Así confirmamos que eres tú.",
  missingToken:
    "No encontramos una invitación en este enlace. Pide a tu clínica que te envíe una nueva.",
  invalidOrExpired:
    "Esta invitación no es válida o ya venció. Pide a tu clínica una nueva invitación.",
  missingConsent: "Para continuar debes aceptar el tratamiento de datos.",
  sessionMismatch:
    "El correo de esta sesión no coincide con la invitación. Abre el enlace de tu correo e inténtalo de nuevo.",
  genericError: "No pudimos completar esto ahora. Inténtalo de nuevo en un momento.",
  fichaTitle: "Tu ficha",
  fichaLead:
    "Solo lo esencial para que tu clínica sepa cómo llamarte. Los datos de la organización los asigna tu equipo y no se pueden cambiar aquí.",
  firstName: "Nombre",
  lastName: "Apellido",
  phone: "Teléfono (opcional)",
  phoneHint: "Si lo compartes, usa el formato internacional, por ejemplo +593…",
  locale: "Idioma",
  localeEs: "Español",
  identityTitle: "Asignado por tu clínica",
  identityHint: "Estos identificadores no se pueden editar desde la app.",
  saveFicha: "Guardar y entrar",
  savingFicha: "Guardando…",
  homeGreeting: (name?: string) =>
    name ? `Hola, ${name}` : "Hola, bienvenida o bienvenido",
  homeLead: "Cuando quieras, registra lo que te resulte más fácil hoy.",
  homeEmpty:
    "Todavía no hay check-ins. No hay prisa: empieza por una pastilla cuando te sientas lista o listo.",
  pillDose: "Dosis",
  pillDoseHint: "Anota si aplicaste tu dosis",
  pillGi: "Síntomas GI",
  pillGiHint: "Cómo te sientes en el estómago",
  pillWeight: "Peso",
  pillWeightHint: "Registra tu peso cuando quieras",
  stubSoonTitle: "Muy pronto",
  stubSoonBody:
    "Esta pantalla es un espacio reservado. El registro clínico llegará en la siguiente vertical; por ahora solo puedes volver al inicio.",
  backHome: "Volver al inicio",
  profileLink: "Tu ficha",
  demoBanner:
    "Modo local: la sesión y el accept están simulados hasta conectar Supabase y el API.",
} as const;
