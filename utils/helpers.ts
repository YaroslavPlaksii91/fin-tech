import Router from 'next/router';
import { AxiosError } from 'axios';
import { NextApiResponse } from 'next';

const Helpers = {
  isClient() {
    return typeof window !== 'undefined';
  },
  redirectTo(server: NextApiResponse, to: string) {
    if (server) {
      server.writeHead(302, {
        Location: to
      });
      server.end();
    } else {
      Router.push(to);
    }
  },
  handleServerErrors(err: AxiosError) {
    let errors: Record<string, string> = {};
    if (err.response && err.response.data) {
      const { data } = err.response;
      if (typeof data !== 'string') {
        Object.keys(data).forEach((key) => {
          errors[key] = Array.isArray(data[key])
            ? data[key].join(', ')
            : data[key];
        });
      } else {
        errors = { error: data };
      }
    }
    return errors;
  },
  cutString(string = '', chars: number, overflow = '...') {
    const overflowStr = string.length > chars ? overflow : '';
    return string.substr(0, chars) + overflowStr;
  },
  tinyNumber(amount: number) {
    if (!amount) {
      return 0;
    }
    if (amount < 1000) {
      return amount;
    } else {
      return `${parseFloat((amount / 1000).toString()).toFixed(1)}K`;
    }
  },
  mbToBytes(mb: number) {
    return mb * 1048576;
  },
  getPagesNumber(count: number, pageSize = 20) {
    return Math.ceil(count / pageSize);
  },
  objToString(obj: Record<string, string>) {
    return Object.values(obj).join(', ');
  }
};

export default Helpers;
