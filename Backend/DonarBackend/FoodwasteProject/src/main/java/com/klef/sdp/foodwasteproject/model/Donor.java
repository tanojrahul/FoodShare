package com.klef.sdp.foodwasteproject.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "donor_table")
public class Donor 
{
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name="donor_id")
private int id;
@Column(name="donor_name",length = 50,nullable = false)
private String name;
@Column(name="donor_gender",length = 10,nullable = false)
private String gender;
@Column(name="donor_dob",length = 20,nullable = false)
private String dob;
@Column(name="donor_email",length = 50,nullable = false,unique=true)
private String email;
@Column(name="donor_uname",length = 50,nullable = false,unique=true)
private String username;
@Column(name="donor_pwd",length = 50,nullable = false)
private String password;
@Column(name="donor_mobileno",length = 20,nullable = false,unique=true)
private String mobileno;
@Column(name="donor_location",length = 50,nullable = false)
private String location;
@Column(name = "donor_adhar",length = 13,nullable = false)
private String adhar;
@Column(name = "ffsai_no",length = 15,nullable = false)
private String ffsai_no;
public int getId() {
	return id;
}
public void setId(int id) {
	this.id = id;
}
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public String getGender() {
	return gender;
}
public void setGender(String gender) {
	this.gender = gender;
}
public String getDob() {
	return dob;
}
public void setDob(String dob) {
	this.dob = dob;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
public String getUsername() {
	return username;
}
public void setUsername(String username) {
	this.username = username;
}
public String getPassword() {
	return password;
}
public void setPassword(String password) {
	this.password = password;
}
public String getMobileno() {
	return mobileno;
}
public void setMobileno(String mobileno) {
	this.mobileno = mobileno;
}
public String getLocation() {
	return location;
}
public void setLocation(String location) {
	this.location = location;
}
public String getAdhar() {
	return adhar;
}
public void setAdhar(String adhar) {
	this.adhar = adhar;
}
public String getFfsai_no() {
	return ffsai_no;
}
public void setFfsai_no(String ffsai_no) {
	this.ffsai_no = ffsai_no;
}
}
