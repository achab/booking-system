import { Button } from "@material-ui/core";
import { Form, Formik, Field } from "formik";
import * as React from "react";
import { MyField } from "./MyField";

export const MyForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ name: "", timeslot: "", roomnumber: "", newStatus: "" }}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      {({ values }) => (
        <Form>
          <div>
            <Field name="name" placeholder="name" component={MyField} />
          </div>
          <div>
            <Field
              name="timeslot"
              placeholder="time slot"
              component={MyField}
            />
          </div>
          <div>
            <Field
              name="roomnumber"
              placeholder="roomnumber"
              component={MyField}
            />
          </div>
          <div>
            <Field
              name="newStatus"
              placeholder="new status"
              component={MyField}
            />
          </div>
          <Button type="submit">submit</Button>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </Form>
      )}
    </Formik>
  );
};
