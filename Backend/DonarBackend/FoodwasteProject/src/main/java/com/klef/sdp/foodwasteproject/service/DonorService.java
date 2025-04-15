package com.klef.sdp.foodwasteproject.service;

import com.klef.sdp.foodwasteproject.model.Donor;

public interface DonorService 
{
	 public String donorregistration(Donor donor);
	  public Donor checkdonorlogin(String username,String password);

}
