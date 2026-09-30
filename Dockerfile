FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Server config: compression, caching and security headers
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf

# Copy your static files (see .dockerignore for what is excluded)
COPY . /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/nginx

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
