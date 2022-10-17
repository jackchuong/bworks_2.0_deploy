import * as React from "react";
import { SimpleForm, TextInput, Edit, DateInput } from "react-admin";

import Grid from "@mui/material/Grid";
import { RichTextInput } from "ra-input-rich-text";

const EditScreen = () => (
  <Edit>
   <SimpleForm>
      <Grid container spacing={1}>
        <Grid item xs={12} md={4} lg={3} xl={2}>
          <TextInput source="name" fullWidth required />
        </Grid>
        <Grid item md={12} />
        <Grid item xs={12} md={4} lg={3} xl={2}>
          <TextInput source="currency" fullWidth required />
        </Grid>

        <Grid item xs={12} md={4} lg={3} xl={2}>
          <DateInput source="date" fullWidth />
        </Grid>
        <Grid item md={12} />
       
        <Grid item xs={12} md={8} lg={6} xl={4}>
          <RichTextInput source="description" fullWidth />
        </Grid>
      </Grid>
    </SimpleForm>
  </Edit>
);

export default EditScreen;
