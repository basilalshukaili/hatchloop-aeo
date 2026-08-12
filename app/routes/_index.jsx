import { redirect } from '@remix-run/node';

export function loader({ request }) {
  const url = new URL(request.url);
  // Shopify opens the embedded app at the root with ?shop=&host=&embedded=1&id_token=…
  // Forward the FULL query string into the authenticated app so App Bridge gets `host`
  // and the auth strategy gets `id_token`. Only bare human visits go to the marketing site.
  if (url.searchParams.get('shop')) {
    return redirect(`/app?${url.searchParams.toString()}`);
  }
  return redirect('https://hatchloop.dev');
}
