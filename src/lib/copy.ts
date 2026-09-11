export const DISCLAIMER =
  "Esta aplicación facilita el registro y la comunicación. No diagnostica, no prescribe y no reemplaza la consulta médica ni la información oficial del medicamento.";

export const COPY = {
  appName: "Kodevant",
  appShortName: "Paciente",
  invitationEyebrow: "Invitación",
  joinTitle: (clinicName: string) => `Unirte a ${clinicName}`,
  joinLead:
    "Te invitaron a acompañar tu tratamiento. Aquí registrarás dosis, síntomas digestivos (GI) y peso, con calma y a tu ritmo.",
  consentEyebrow: "Consentimiento",
  consentTitle: "Tratamiento de datos de salud",
  consentCheckbox:
    "He leído y acepto el consentimiento de tratamiento de datos de salud.",
  acceptCta: "Aceptar invitación",
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
  fichaTitle: "Tu ficha mínima",
  fichaLead:
    "Solo nombre, apellido, teléfono e idioma. Clínica, médico responsable y sede los asigna tu equipo al aceptar la invitación: aquí no se editan.",
  firstName: "Nombre",
  lastName: "Apellido",
  phone: "Teléfono (opcional)",
  phoneHint: "Si lo compartes, usa el formato internacional, por ejemplo +593…",
  locale: "Idioma",
  localeEs: "Español",
  identityTitle: "Asignado por tu clínica",
  identityHint:
    "Tu clínica, médico responsable y sede quedan fijos al aceptar la invitación. No son campos de esta ficha.",
  identityClinic: "Clínica",
  identityTeam:
    "El médico responsable y la sede ya están asignados. No aparecen como campos editables.",
  saveFicha: "Guardar y entrar",
  savingFicha: "Guardando…",
  homeGreeting: (name?: string) =>
    name ? `Hola, ${name}` : "Hola, bienvenida o bienvenido",
  homeLead: "Elige un registro: dosis, síntomas GI o peso.",
  homeEmpty:
    "Todavía no hay registros de dosis, síntomas GI ni peso. Empieza por la pastilla que te resulte más fácil.",
  pillDose: "Dosis",
  pillDoseHint: "Anota si aplicaste tu dosis",
  pillGi: "Síntomas GI",
  pillGiHint: "Náuseas, acidez u otros síntomas digestivos",
  pillWeight: "Peso",
  pillWeightHint: "Registra tu peso cuando quieras",
  stubSoonTitle: "Muy pronto",
  stubSoonBody:
    "Esta pantalla es un espacio reservado. El registro de dosis, síntomas GI o peso llegará en la siguiente vertical; por ahora solo puedes volver al inicio.",
  backHome: "Volver al inicio",
  profileLink: "Tu ficha",
  demoBanner:
    "Modo local: la sesión y el accept están simulados hasta conectar Supabase y el API.",
} as const;
