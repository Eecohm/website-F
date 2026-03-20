/**
 * validateStep.js
 * ---------------
 * Per-step validation. Returns { valid: bool, errors: {} }.
 */

export function validateRoleSelector({ orgSlug, orgStatus, orgError, roleId }) {
  const errors = {};
  if (!orgSlug.trim()) {
    errors.orgSlug = "Organization slug is required.";
  } else if (orgStatus === "error") {
    errors.orgSlug = orgError || "Invalid organization.";
  } else if (orgStatus !== "ok") {
    errors.orgSlug = "Please wait for the organization to be verified.";
  }
  if (!roleId) errors.roleId = "Please select a role.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateAccountInfo({ email, password, confirm_password, first_name, last_name }) {
  const errors = {};
  if (!first_name.trim()) errors.first_name = "First name is required.";
  if (!last_name.trim()) errors.last_name = "Last name is required.";
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (!confirm_password) {
    errors.confirm_password = "Please confirm your password.";
  } else if (password !== confirm_password) {
    errors.confirm_password = "Passwords do not match.";
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePersonalInfo({ date_of_birth, gender }) {
  const errors = {};
  if (!gender) errors.gender = "Please select your gender.";
  // date of birth is optional but must be valid if provided
  if (date_of_birth) {
    const d = new Date(date_of_birth);
    if (isNaN(d.getTime())) errors.date_of_birth = "Enter a valid date.";
    else if (d > new Date()) errors.date_of_birth = "Date of birth cannot be in the future.";
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateAddress(data) {
  // Address is optional — no required fields
  return { valid: true, errors: {} };
}

export function validateTeacher({ specialization, qualification, joining_date }) {
  const errors = {};
  if (!specialization.trim()) errors.specialization = "Specialization is required.";
  if (!qualification.trim()) errors.qualification = "Qualification is required.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStudent({ grade, enrollment_number, guardian_name, guardian_relation }) {
  const errors = {};
  if (!grade.trim()) errors.grade = "Grade/Class is required.";
  if (!guardian_name.trim()) errors.guardian_name = "Guardian name is required.";
  if (!guardian_relation) errors.guardian_relation = "Guardian relation is required.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStaff({ department, designation }) {
  const errors = {};
  if (!department.trim()) errors.department = "Department is required.";
  if (!designation.trim()) errors.designation = "Designation is required.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateParent({ linked_student_id, relation_to_student }) {
  // parent linking is optional at registration
  return { valid: true, errors: {} };
}

export function validateVendor({ company_name, service_type }) {
  const errors = {};
  if (!company_name.trim()) errors.company_name = "Company name is required.";
  if (!service_type.trim()) errors.service_type = "Service type is required.";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateReview() {
  return { valid: true, errors: {} };
}

const VALIDATORS = {
  accountInfo: validateAccountInfo,
  personalInfo: validatePersonalInfo,
  address: validateAddress,
  teacher: validateTeacher,
  student: validateStudent,
  staff: validateStaff,
  parent: validateParent,
  vendor: validateVendor,
  review: validateReview,
};

export function getValidator(stepKey) {
  return VALIDATORS[stepKey] || (() => ({ valid: true, errors: {} }));
}
