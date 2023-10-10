import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DateField,
  SingleFieldList,
  ChipField,
  ReferenceArrayField,
  ReferenceField,
  TextInput,
  BooleanField,
  CreateButton,
  ExportButton,
  TopToolbar,
  useRecordContext,
} from "react-admin";
import CurrencyNumberField from "../components/currencyNumberField";
import LinkBidField from "../components/sumBidsField";
import { Box, Drawer } from "@mui/material";
import Steps from "../components/jobApplicationAside";

const filters = [<TextInput label="Search" source="textSearch" alwaysOn />];

const JobCreateButton = () => <CreateButton label="Create new job" />;

const JobListActions = () => (
  <TopToolbar>
    <JobCreateButton />
    <ExportButton />
  </TopToolbar>
);

const JobPanel = () => {
  const record = useRecordContext();
  return <div dangerouslySetInnerHTML={{ __html: record.description }} />;
};

const ListScreen = () => {
  const [record, setRecord] = React.useState(null);
  const rowClick = (id, resource, record) => {
    setRecord(record);
    return null;
  };

  return (
    <Box display="flex">
      <List
        filters={filters}
        perPage={25}
        sort={{ field: "createdAt", order: "desc" }}
        hasCreate
        filter={{ queryType: "employer", isApproved: true }}
        sx={{
          flexGrow: 1,
          transition: (theme: any) =>
            theme.transitions.create(["all"], {
              duration: theme.transitions.duration.enteringScreen,
            }),
          marginRight: record ? "300px" : 0,
        }}
        actions={<JobListActions />}
      >
        <Datagrid rowClick={rowClick} expand={<JobPanel />}>
          <TextField source="name" label="Job name" />
          <CurrencyNumberField source="budget" threshold={10000} />
          <ReferenceField reference="users" source="employerId" link={"show"}>
            <TextField source="fullName" />
          </ReferenceField>
          <ReferenceArrayField
            reference="skills"
            source="skills"
            label="Required skills"
          >
            <SingleFieldList>
              <ChipField source="name" />
            </SingleFieldList>
          </ReferenceArrayField>
          <BooleanField source="isApproved" label="Approval" />

          <DateField source="expireDate" showTime />
          <DateField source="createdAt" showTime />
          <LinkBidField />
          <Drawer
            variant="persistent"
            open={record}
            anchor="right"
            sx={{ zIndex: 100 }}
          >
            {record && <Steps record={record}></Steps>}
          </Drawer>
          <EditButton />
        </Datagrid>
      </List>
    </Box>
  );
};

export default ListScreen;
