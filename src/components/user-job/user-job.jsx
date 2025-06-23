import JobListBase from '../common/job-list-base';

function UserJobList() {
  return (
    <JobListBase
      showEdit={false}
      onBack={null}
      enableSearch={true}
      enablePagination={true}
    />
  );
}

export default UserJobList;