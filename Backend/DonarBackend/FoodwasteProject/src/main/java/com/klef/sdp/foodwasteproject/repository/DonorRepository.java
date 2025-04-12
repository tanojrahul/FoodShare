package com.klef.sdp.foodwasteproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.sdp.foodwasteproject.model.Donor;

@Repository
public interface DonorRepository extends JpaRepository<Donor,Integer>
{
	  public Donor findByUsernameAndPassword(String username, String password);
}



