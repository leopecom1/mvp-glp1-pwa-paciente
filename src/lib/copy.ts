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
  homeLead: "Elegí un registro: dosis, síntomas GI o peso.",
  homeEmptyTitle: "Todavía no hay registros",
  homeEmpty:
    "Cuando anotes una dosis, síntomas GI o el peso, acá vas a ver un resumen. Empezá por la pastilla que te resulte más fácil.",
  homeEmptyCheckInCta: "Anotar un registro",
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
  demoCheckinBanner:
    "Modo local: los registros se guardan en este dispositivo hasta conectar el API (Épica 4).",
  checkInEyebrow: "Registro",
  checkInNav: "Registros",
  saveCheckIn: "Guardar registro",
  savingCheckIn: "Guardando…",
  savedCheckIn: "Registro guardado. Puedes volver al inicio o anotar otro.",
  historyTitle: "Tus últimos registros",
  historyEmpty: "Todavía no hay registros en los últimos 14 días.",
  doseApplied: "Aplicada",
  doseMissed: "Omitida",
  doseAppliedHint: "Registré la dosis de hoy",
  doseMissedHint: "Esta vez no la apliqué",
  doseWhen: "Fecha y hora de la dosis",
  doseMg: "Dosis (mg)",
  doseMgHint: "Si tu plan ya tiene una dosis, la dejamos lista. Puedes ajustarla si tu clínica te lo indicó.",
  doseReason: "Motivo de la omisión",
  doseReasonHint: "Necesario si no aplicaste la dosis.",
  doseSite: "Sitio de inyección (opcional)",
  doseSiteHint: "Opcional. Abdomen, muslo, brazo u otro.",
  doseNoPlan:
    "Tu clínica aún no tiene un plan activo para ti. Pídeles que lo carguen; sin plan no se puede registrar una dosis real.",
  doseDemoPlan: "En modo local usamos una dosis de ejemplo (0,25 mg) para que puedas revisar el formulario.",
  motivo: {
    olvido: "Se me olvidó",
    malestar: "Me sentí mal",
    viaje: "Estaba de viaje",
    falta_medicamento: "No tenía el medicamento",
    indicacion_medica: "Indicación médica",
    otro: "Otro motivo",
  },
  sitio: {
    abdomen: "Abdomen",
    muslo: "Muslo",
    brazo: "Brazo",
    otro: "Otro",
  },
  giLead: "Marca cada síntoma de 0 (nada) a 10 (muy intenso). Toma menos de un minuto.",
  giScaleHint: "0 = nada · 10 = muy intenso",
  giScales: {
    nauseas: "Náuseas",
    vomito: "Vómito",
    diarrea: "Diarrea",
    estrenimiento: "Estreñimiento",
    dolorAbdominal: "Dolor abdominal",
  },
  giUrgent:
    "Si un síntoma está en 8 o más, contactá a tu clínica. Esta aplicación no diagnostica ni indica qué hacer con tu medicación.",
  weightKg: "Peso (kg)",
  weightWhen: "Fecha de la medición",
  weightHint: "Usa el valor que te indique tu báscula. Un decimal está bien.",
  summaryLastDose: "Última dosis",
  summaryAdherence: "Adherencia 7 días",
  summaryLastWeight: "Último peso",
  summaryNoDose: "Aún no registras una dosis.",
  summaryNoWeight: "Aún no registras tu peso.",
  summaryNoAdherence: "Cuando haya un plan activo, aquí verás las dosis aplicadas de la semana.",
  summaryAdherenceValue: (aplicadas: number, esperadas: number) =>
    `${aplicadas} de ${esperadas} dosis`,
  demoAlertsBanner:
    "Modo local: los registros, avisos y el malestar grave se guardan en este dispositivo hasta conectar el API.",
  eaEyebrow: "Malestar grave",
  eaTitle: "Reportar malestar grave",
  eaLead:
    "Usá este formulario si el malestar es intenso o te preocupa. Tu clínica recibe el aviso; no cambia tu medicación desde acá.",
  eaTipo: "Qué estás sintiendo",
  eaTipoHint:
    "Si el dolor abdominal es intenso, elegí esa opción. Tu clínica recibe el aviso; esta aplicación no diagnostica.",
  eaTipos: {
    gi_intolerable: "Dolor abdominal intenso",
    gi_intolerableHint:
      "Intolerancia digestiva grave: dolor fuerte, náuseas o vómitos que no podés sostener.",
    otro_grave: "Otro malestar grave",
    otro_graveHint: "Otra molestia intensa que tu clínica debería conocer ahora.",
  },
  eaSeveridad: "Qué tan intenso es ahora",
  eaSeveridadHint: "Esto avisa a tu clínica. No cambia tu medicación desde esta aplicación.",
  eaSeveridades: {
    p0: "Muy intenso, urgente",
    p1: "Intenso, quiero avisar",
    p2: "Molesto, no urgente",
  },
  eaInicio: "Cuándo empezó",
  eaAccion: "Qué vas a hacer",
  eaAcciones: {
    auto_cuidado: "Me cuido en casa",
    contacto_clinica: "Voy a hablar con mi clínica",
    urgencias: "Voy a urgencias o ya acudí",
    indicacion_medica: "Sigo una indicación médica",
  },
  eaSubmit: "Enviar a mi clínica",
  eaSubmitting: "Enviando…",
  eaSavedTitle: "Tu clínica queda avisada",
  eaSaved:
    "Listo. Si es una emergencia, acudí a urgencias. Esta aplicación no diagnostica ni indica dosis.",
  eaErrorTitle: "No se pudo enviar",
  eaError:
    "No pudimos avisar a tu clínica ahora. Intentá de nuevo en un momento. Si es una emergencia, acudí a urgencias.",
  eaHomeLink: "Reportar malestar grave",
  eaHomeHint: "Solo si el malestar es intenso. No reemplaza a urgencias.",
  eaNotEmergency:
    "Esta aplicación no es un servicio de emergencias. No diagnostica y no indica dosis. Ante una urgencia, acudí a servicios de urgencia.",
  alertP0Title: "Urgente",
  alertP1Title: "Aviso",
  alertP2Title: "Registro pendiente",
  alertContactClinic: "Contactá a tu clínica",
  alertGoEr: "Si es una emergencia, acudí a urgencias",
  alertTalkClinic: "Hablá con tu clínica",
  alertCheckInCta: "Anotar un registro",
  alertFallback:
    "Contactá a tu clínica. Esta aplicación no es un servicio de emergencias; ante una urgencia acudí a servicios de urgencia.",
  alertsEmptyTitle: "Sin avisos por ahora",
  alertsEmpty:
    "No hay nada urgente que avisar. Si te sentís mal o tenés dudas, contactá a tu clínica. Esta aplicación no es un servicio de emergencias.",
  alertsEmptyMalestarCta: "Si el malestar es intenso, reportalo",
  summaryRegion: "Tus últimos registros",
} as const;
