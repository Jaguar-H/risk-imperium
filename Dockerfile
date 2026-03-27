FROM denoland/deno:2.x
COPY . .
RUN deno install
CMD ["deno", "run", "-A", "main.js"]