FROM eclipse-temurin:21

WORKDIR /builder

COPY . .

RUN ./gradlew build

WORKDIR /app

RUN cp ../builder/build/libs/currency-*-SNAPSHOT.jar app.jar && rm -rf /builder

CMD [ "java", "-jar", "app.jar" ]