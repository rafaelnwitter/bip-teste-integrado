package com.example.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Beneficios API")
                        .description("API REST para gerenciamento de Benefícios - CRUD completo e Transferência de valores entre benefícios. "
                                + "Parte do projeto BIP Teste Integrado, com arquitetura em camadas (DB → EJB → Backend → Frontend).")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Rafael Nwitter")
                                .url("https://github.com/rafaelnwitter/bip-teste-integrado"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
