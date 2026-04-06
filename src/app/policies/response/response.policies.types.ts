// src/app/policies/response/response.policies.types.ts

export type ResponsePolicySecurity = {
  nonce: string;
};

export type ResponsePolicyRobots = {
  allowIndex: boolean;
  allowFollow: boolean;
  noarchive: boolean;
  nosnippet: boolean;
  noimageindex: boolean;
};

export type ResponsePolicyContext = {
  req: Request;
  env: Env;
  status: number;
  security: {
    nonce: string;
  };
  robots: ResponsePolicyRobots;
};

export type ResponsePolicy = (
  context: ResponsePolicyContext,
  response: Response,
) => Response;
