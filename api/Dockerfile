FROM openjdk:11.0.15-jdk as builder

WORKDIR /build
COPY . .

RUN ./gradlew clean shadowJar


FROM openjdk:11.0.15-jre as runner

WORKDIR /app
COPY --from=builder /build/build/libs/dev.takasaki.api-0.0.1-all.jar app.jar

ENV PORT=3000
ENV JWT_SECRET=pls-change-me
ENV DB_URL=jdbc:mysql://localhost:3306/doacoes
ENV DB_USERNAME=root
ENV DB_PASSWORD=root

EXPOSE ${PORT}

CMD [ "java", "-jar", "app.jar" ]