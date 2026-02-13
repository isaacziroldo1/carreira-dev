import { createGlobalStyle, css } from "styled-components";
import { agendaStyles } from "./agenda";
import { baseStyles } from "./base";
import { calendarStyles } from "./calendar";
import { formsStyles } from "./forms";
import { layoutStyles } from "./layout";
import { patientStyles } from "./patient";
import { reportStyles } from "./report";
import { responsiveStyles } from "./responsive";

const composedStyles = css`
  ${baseStyles}
  ${layoutStyles}
  ${reportStyles}
  ${formsStyles}
  ${patientStyles}
  ${agendaStyles}
  ${calendarStyles}
  ${responsiveStyles}
`;

export const GlobalStyles = createGlobalStyle`
  ${composedStyles}
`;
