package com.example.meal_mate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
public class MealMateApplication {

	public static void main(String[] args) {
		SpringApplication.run(MealMateApplication.class, args);
	}

}
