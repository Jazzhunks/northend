import React from "react";

const SchoolVisitsTab = React.memo(({ adminData, innerSearch, schKind }) => {
  const { summary, enrollments, scholarshipApps, jobApps, inquiries, courses, notices, jobs, centers, testimonials, results, gallery, adminCampaigns, posts, loadingData, load, filteredEnrollments, filteredScholarships, filteredJobApps, filteredCourses, filteredNotices, filteredJobs, filteredCenters, filteredTestimonials, filteredResults, filteredCampaigns, filteredInquiries, filteredGallery, galleryCategories, filteredPosts, updateStatus, post, del, setFeatured, clearFeatured } = adminData;

  return (
    <>
      <AdminSchoolVisits />
    </>
  );
});

export default SchoolVisitsTab;
