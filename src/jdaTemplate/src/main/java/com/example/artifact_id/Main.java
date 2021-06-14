package com.example.artifact_id;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import javax.security.auth.login.LoginException;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.dv8tion.jda.api.sharding.DefaultShardManagerBuilder;
import net.dv8tion.jda.api.sharding.ShardManager;

public class Main {
	
	private static Logger LOG=LoggerFactory.getLogger(Main.class);
	
	public static void main(String[] args) {
		try {
			JSONObject json=readConfig();
			start(json.getString("token"), json.getString("prefix"));
		} catch (IOException e) {
			LOG.error("Cannot read config.json",e);
		} catch (JSONException e) {
			LOG.error("The file config.json does not contain the necessary elements 'token' and 'prefix'.");
		} catch (LoginException e) {
			LOG.error("Cannot login - make sure the token is correct");
		} catch (IllegalArgumentException e) {
			LOG.error("No token was entered.");
		} 
	}
	
	private static JSONObject readConfig() throws IOException {
		try(BufferedReader br=new BufferedReader(new InputStreamReader(new FileInputStream("config.json"),StandardCharsets.UTF_8))){
			JSONTokener tokener=new JSONTokener(br);
			return new JSONObject(tokener);
		} 
	}
	
	private static void start(String token,String prefix) throws LoginException, IllegalArgumentException {
		DefaultShardManagerBuilder.createDefault(token)
				.addEventListeners(new CommandListener(prefix))
				.build();
		
	}
}
