FROM eclipse-temurin:21

COPY . .

ARG JAR_FILE=build/libs/currency-converter-*-SNAPSHOT.jar

RUN ./gradlew build && mkdir /app && cp ${JAR_FILE} app/app.jar

WORKDIR /app

ENTRYPOINT ["java","-jar","app.jar"]