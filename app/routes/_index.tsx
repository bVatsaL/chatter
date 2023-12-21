import { Form, useLoaderData } from '@remix-run/react';
import createServerClient from '../../utils/supabase.server';
import { ActionFunctionArgs, json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import Login from '../../components/login';
import RealtimeMessages from 'components/realtime-messages';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const supabse = createServerClient({ request, response });

  const { message } = Object.fromEntries(await request.formData());
  const { error } = await supabse.from('messages').insert({ content: String(message) });

  if (error) {
    console.log(error);
  }

  return json(null, { headers: response.headers });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const supabase = createServerClient({ request, response });
  const { data } = await supabase.from('messages').select();
  return json({ messages: data ?? [] }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  return (
    <>
      <Login />
      <RealtimeMessages serverMessages={messages} />
      <Form method='POST'>
        <input type='text' name='message' />
        <button type='submit'>Send</button>
      </Form>
    </>
  );
};
