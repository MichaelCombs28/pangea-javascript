import { FC } from "react";
import isEmpty from "lodash/isEmpty";

import { useTheme } from "@mui/material/styles";
import { Container, Typography, Stack, Box } from "@mui/material";

import { JsonViewer } from "@pangeacyber/react-shared";
// FIXME: Diff needs to be split out to react-shared
import { Change } from "../../hooks/diff";

export const StringField: FC<{
  inRow?: boolean;
  title: string;
  value: string;
  changes?: Change[];
  uniqueId: string;
}> = ({ title, inRow, value, changes = [], uniqueId }) => {
  const direction = inRow ? "column" : "row";

  return (
    <Stack spacing={1} direction={direction} alignItems="start">
      <Typography variant="body2" sx={{ width: "120px", paddingTop: "4px" }}>
        {title}
      </Typography>
      <Container sx={{ padding: "4px!important" }}>
        <Typography color="textPrimary" variant="body2">
          {!isEmpty(changes)
            ? changes.map((change, idx) => {
                return (
                  <span
                    key={`change-found-${idx}-${uniqueId}`}
                    style={{
                      backgroundColor:
                        // FIXME: Change color needs to be controlled through a prop
                        change.added || change.removed ? "#FFFF0B" : "inherit",
                      color:
                        change.added || change.removed ? "#000" : "inherit",
                    }}
                  >
                    {change.value}
                  </span>
                );
              })
            : value ?? "-"}
        </Typography>
      </Container>
    </Stack>
  );
};

const parseJson = (value: any): object | null => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const StringJsonField: FC<{
  inRow?: boolean;
  title: string;
  value: any;
  changes?: Change[];
  uniqueId: string;
  shouldHighlight?: (c: Change) => boolean;
}> = ({
  title,
  inRow,
  value,
  changes = [],
  uniqueId,
  shouldHighlight = () => true,
}) => {
  const theme = useTheme();
  const jsonValue = parseJson(value);

  if (jsonValue && typeof jsonValue === "object")
    return (
      <Stack direction="row" spacing={1} sx={{ width: "100%", pt: 0.5 }}>
        <Typography variant="body2" sx={{ width: "120px" }}>
          {title}
        </Typography>
        <Box sx={{ width: "100%", flexGrow: "1", marginTop: "4px!important" }}>
          <JsonViewer
            src={jsonValue}
            highlights={changes.filter(shouldHighlight).map((c) => ({
              value: c.value,
              color: "highlight",
            }))}
            depth={3}
          />
        </Box>
      </Stack>
    );

  return (
    <StringField
      title={title}
      value={value}
      inRow={inRow}
      changes={changes}
      uniqueId={uniqueId}
    />
  );
};

export default StringJsonField;
