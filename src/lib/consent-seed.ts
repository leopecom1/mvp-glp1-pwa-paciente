/** Seed copy from mvp-glp1-api docs/epica1-consentimientos-draft-producto.md (Iris, draft — not legal). */
export const TRATAMIENTO_DATOS_SEED = {
  consentType: "tratamiento_datos" as const,
  version: "v1",
  locale: "es",
  title: "Tratamiento de datos de salud",
  body: `Autorizo a la clínica / organización que me invita a tratar mis datos personales y de salud (peso, dosis, síntomas, mediciones, notas clínicas relacionadas y datos de contacto) a través de esta plataforma, con el fin de dar seguimiento a mi plan terapéutico y facilitar la comunicación con mi equipo médico.

Entiendo que:
- Esta aplicación no diagnostica, no prescribe y no reemplaza la consulta médica ni la información oficial del medicamento.
- Ante una emergencia debo acudir a servicios de urgencia; las alertas de la app no son un servicio de emergencia.
- Puedo solicitar acceso, rectificación o eliminación de mis datos según la normativa aplicable, contactando a la clínica.
- El tratamiento se realiza bajo responsabilidad de la clínica / organización y de los proveedores técnicos que la soportan, con medidas de seguridad razonables.`,
};
