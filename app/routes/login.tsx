import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useSubmit,
} from "remix";
import { object, string } from "yup";
import Button from "~/components/Button";
import { authenticator } from "~/services/auth.server";
import { i18n } from "~/utils/i18n.server";

export let loader: LoaderFunction = async ({ request }) => {
  // If the user is already authenticated redirect to /dashboard directly
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });

  return json({
    user,
    i18n: await i18n.getTranslations(request, ["translation"]),
  });
};

export const action: ActionFunction = async ({ request, context }) => {
  console.log("Login the user");

  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/dashboard",
      context, // optional
    });
  } catch (err: any) {
    if ("status" in err && err.status === 302) {
      throw err;
    }
    return { error: true };
  }
};

export default function Login() {
  const { t } = useTranslation();

  const submit = useSubmit();

  const validationSchema = object({
    email: string()
      .email(t("Error.BadEmailFormat"))
      .required(t("Error.EmailRequired")),
    password: string().required(t("Error.PasswordRequired")),
  });

  const error = useActionData();

  console.log("error", error);

  return (
    <div className="page place-content-center">
      <div className="card self-center w-1/3">
        <h1 className="uppercase flex justify-center">
          {t("Form.Login.Title")}
        </h1>
        <Formik
          validationSchema={validationSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={function (values: FormikValues) {
            submit(values, { action: "/login", method: "post" });
          }}
        >
          <Form className="flex flex-col">
            <Field
              type="email"
              name="email"
              id="email"
              placeholder={t("Placeholder.Email")}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500"
            />
            <Field
              type="password"
              name="password"
              id="password"
              placeholder={t("Placeholder.Password")}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500"
            />
            <Button text={t("Button.Login")} type={"submit"} className="mt-8" />
          </Form>
        </Formik>
        {error && (
          <div>
            <h3 className="text-red-500">{t("Error.BadLogin")}</h3>
            {/* SOSTITUIRE CON TOAST */}
          </div>
        )}
      </div>
    </div>
  );
}
