FROM public.ecr.aws/spacelift/runner-opentofu:latest

USER root

RUN apk add --no-cache \
    libatomic \
    libstdc++ \
    curl \
    xz

ARG NODE_VERSION=26.13.0

RUN mkdir -p /opt/node \
    && curl -fsSL \
       "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64-musl.tar.xz" \
       | tar -xJ --strip-components=1 -C /opt/node

ENV PATH="/opt/node/bin:${PATH}"

RUN node --version && npm --version

USER spacelift
