FROM node:alpine as builder
WORKDIR /app
ADD ./package*.json ./
RUN npm ci
ADD ./src ./src
ADD ./public ./public
ADD ./tsconfig*.json ./
ADD ./postcss.config.js ./
ADD ./tailwind.config.js ./
ADD ./next.config.js ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:alpine
RUN apk add --no-cache openssh
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1
ADD ./public ./public
ADD ./package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER node
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
