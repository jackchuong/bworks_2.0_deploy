import * as React from "react";
import {
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceArrayInput,
  DateTimeInput,
  Edit,
  ReferenceInput,
  AutocompleteArrayInput,
  useEditController,
  FunctionField,
} from "react-admin";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { RichTextInput } from "ra-input-rich-text";
import moment from "moment";

const filterToQuery = (searchText) => ({ textSearch: searchText });

const EditScreen = () => {
  const { id } = useParams();
  const { record, save, isLoading } = useEditController({
    resource: "postjobs",
    id,
  });
  if (isLoading) return null;

  const validate = (values) => {
    const errors = {} as any;
    const postedDate = moment(record.createdAt).add(1, "months").toString();

    if (moment(values.expireDate).isBefore(postedDate)) {
      errors.expireDate = "Must be 1 month greater than posted date";
    }

    if (moment(values.expectDate).isBefore(postedDate)) {
      errors.expectDate = "Must be 1 month greater than posted date";
    }
    return errors;
  };

  return (
    <Edit>
      <SimpleForm validate={validate}>
        <Grid container spacing={0.5}>
          <Grid item xs={12} md={6} lg={5} xl={3}>
            <TextInput source="name" fullWidth required label="Job name" />
          </Grid>
          <Grid item md={12} />

          <Grid item xs={12} md={4} lg={3} xl={2}>
            <ReferenceInput source="currencyId" reference="currencies">
              <SelectInput optionText="name" fullWidth required />
            </ReferenceInput>
          </Grid>

          <Grid item xs={12} md={4} lg={3} xl={2}>
            <NumberInput
              source="budget"
              fullWidth
              required
              min={5}
              defaultValue={5}
            />
          </Grid>
          <Grid item md={12} />
          <Grid item xs={12} md={4} lg={3} xl={2}>
            <NumberInput
              source="minBidValue"
              fullWidth
              defaultValue={0}
              label="Min requested budget"
              min={0}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3} xl={2}>
            <NumberInput
              source="requiredAmountToBid"
              fullWidth
              label="Required amount (Ada) to apply"
              defaultValue={0}
              min={0}
            />
          </Grid>
          <Grid item md={12} />
          <Grid item xs={12} md={4} lg={3} xl={2}>
            <DateTimeInput
              source="expireDate"
              fullWidth
              required
              label="Job expire date"
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3} xl={2}>
            <DateTimeInput
              source="expectDate"
              fullWidth
              required
              label="Job deadline"
            />
          </Grid>
          <Grid item md={12} />
          <Grid item xs={12} md={8} lg={6} xl={4}>
            <ReferenceArrayInput source="skills" reference="skills" fullWidth>
              <AutocompleteArrayInput
                optionText={"name"}
                filterToQuery={filterToQuery}
              />
            </ReferenceArrayInput>
          </Grid>
          <Grid item md={12} />
          <Grid item xs={12} md={8} lg={6} xl={4}>
            <ArrayInput source="tasks" fullWidth>
              <SimpleFormIterator inline>
                <TextInput source="name" helperText={false} fullWidth />
              </SimpleFormIterator>
            </ArrayInput>
          </Grid>
          <Grid item md={12} />
          <Grid item xs={12} md={4} lg={3} xl={2}>
            <FunctionField
              render={(record) =>
                `Posted at ${moment(record.createdAt).format(
                  "MM/DD/YYYY HH:mm:ss"
                )} `
              }
            />
          </Grid>

          <Grid item md={12} />
          <Grid item xs={12} md={10} lg={8} xl={6}>
            <RichTextInput
              source="description"
              fullWidth
              label="Job description"
            />
          </Grid>
        </Grid>
      </SimpleForm>
    </Edit>
  );
};

export default EditScreen;
