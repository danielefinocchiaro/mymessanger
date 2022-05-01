import {
  json,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { LinksFunction, MetaFunction } from "remix";
import tailwindStylesheetUrl from "./styles/app.css";
import { authenticator } from "./services/auth.server";
import { useSetupTranslations } from "remix-i18next";
import { i18n } from "./utils/i18n.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Messenger",
  description: "A simple messenger by danielefinocchiaro",
  viewport: "width=device-width,initial-scale=1",
});

export let loader: LoaderFunction = async ({ request }) => {
  let locale = await i18n.getLocale(request);
  return json({ locale });
};

export default function App() {
  const { locale } = useLoaderData();
  useSetupTranslations(locale);

  return (
    <html lang={locale}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
