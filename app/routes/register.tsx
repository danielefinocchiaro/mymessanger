import { UserState } from "@prisma/client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { ActionFunction, json, LoaderFunction, useSubmit } from "remix";

import { object, ref, string } from "yup";
import Button from "~/components/Button";
import { hashPassword } from "~/services/auth.server";
import { db } from "~/utils/db.server";
import { i18n } from "~/utils/i18n.server";

export let loader: LoaderFunction = async ({ request }) => {
  return json({
    i18n: await i18n.getTranslations(request, ["translation"]),
  });
};

export const action: ActionFunction = async ({ request, context }) => {
  const form = await request.formData();
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const email = form.get("email");
  const password = form.get("password");
  const passwordConfirm = form.get("passwordConfirm");

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof passwordConfirm !== "string"
  )
    throw new Error("Form not submitted correctly");

  if (await db.user.findFirst({ where: { email } }))
    throw new Error(t("Error.EmailAlredyRegistered"));

  const hash = await hashPassword(password);

  return db.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: { create: { hash } },
      state: UserState.Inactive,
      banned: false,
    },
  });
};
export default function SignupForm() {
  const submit = useSubmit();
  const { t } = useTranslation();

  const validationSchema = object({
    firstName: string()
      .min(2, t("Error.FirstNameLength"))
      .required(t("Error.FirstNameRequired")),
    lastName: string()
      .min(2, t("Error.LastNameLength"))
      .required(t("Error.LastNameRequired")),
    email: string()
      .email(t("Error.BadEmailFormat"))
      .required(t("Error.EmailRequired")),
    password: string().required(t("Error.PasswordRequired")),
    passwordConfirm: string()
      .required(t("Error.PasswordConfirmRequired"))
      .equals([ref("password")], t("Error.PasswordConfirmMatch")),
  });

  return (
    <div className="page place-content-center">
      <div className="card self-center w-1/2">
        <h1 className="flex justify-center uppercase">
          {t("Form.Register.Title")}
        </h1>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: "",
          }}
          validationSchema={validationSchema}
          validateOnBlur={false}
          onSubmit={(values) => {
            submit(values, { method: "post", action: "/register" });
          }}
        >
          <Form className="flex flex-col">
            <Field
              name="firstName"
              id="firstName"
              type="text"
              placeholder={t("Placeholder.FirstName")}
            />
            <ErrorMessage
              component={"div"}
              className="text-red-500"
              name="firstName"
            />
            <Field
              name="lastName"
              type="text"
              placeholder={t("Placeholder.LastName")}
            />
            <ErrorMessage
              component={"div"}
              className="text-red-500"
              name="lastName"
            />
            <Field
              name="email"
              type="email"
              placeholder={t("Placeholder.Email")}
            />
            <ErrorMessage
              component={"div"}
              className="text-red-500"
              name="email"
            />
            <Field
              name="password"
              type="password"
              placeholder={t("Placeholder.Password")}
            />
            <ErrorMessage
              component={"div"}
              className="text-red-500"
              name="password"
            />
            <Field
              name="passwordConfirm"
              type="password"
              placeholder={t("Placeholder.ConfirmPassword")}
            />
            <ErrorMessage
              component={"div"}
              className="text-red-500"
              name="passwordConfirm"
            />

            <Button
              text={t("Button.Register")}
              type={"submit"}
              className="mt-8"
            />
          </Form>
        </Formik>
      </div>
    </div>
  );
}
