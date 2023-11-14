import { NextPageContext } from 'next';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

class Cookies {
  static get(name: string, ctx: NextPageContext): string | undefined {
    const cookies = parseCookies(ctx);
    return cookies[name];
  }

  static set(
    name: string,
    val: string,
    ctx?: NextPageContext,
    opts = { path: '/' }
  ): void {
    setCookie(ctx, name, val, opts);
  }

  static remove(
    name: string,
    ctx?: NextPageContext,
    opts = { path: '/' }
  ): void {
    destroyCookie(ctx, name, opts);
  }
}

export default Cookies;
