package com.klef.sdp.foodwasteproject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.sdp.foodwasteproject.model.Donor;
import com.klef.sdp.foodwasteproject.repository.DonorRepository;

@Service
public class DonorServiceimpl implements DonorService
{
    @Autowired
    private DonorRepository donorRepository;

    @Override
    public String donorregistration(Donor donor) 
    {
        donorRepository.save(donor);
        return "Donor Registered Successfully";
    }

    @Override
    public Donor checkdonorlogin(String username,String password) 
    {
        return donorRepository.findByUsernameAndPassword(username, password);
    }
}
