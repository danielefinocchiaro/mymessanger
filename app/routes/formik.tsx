import { useFormik } from "formik";

export default function SignupForm() {
  const formik = useFormik({
    initialValues: { firstName: "", lastName: "", email: "" },
    onSubmit: (values) => {
      console.log(values, "values");
    },
    enableReinitialize: true,
  });

  console.log(formik.values, "formik.values");

  /* validationSchema={Yup.object({
    firstName: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Required"),
    lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email addresss`")
      .required("Required"),
  })}
 */
  return (
    <>
      <h1>Subscribe!</h1>

      <form>
        <input
          name="firstName"
          id="firstName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.firstName}
          placeholder="Jane"
        />
        <input
          name="lastName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.lastName}
          placeholder="Doe"
        />
        <input
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="jane@formik.com"
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
