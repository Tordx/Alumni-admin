import { fetchadmindata, fetchalleducation, fetchallemployment, fetchallpersonalinfo, fetchupdate } from '../../firebase/function';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableButton } from 'screens/components/global/buttons';
import Card from 'screens/components/global/card';
import { LoginFields } from 'screens/components/global/fields';
import { admindata, educationdata, employmentdata, id, idprocessed, personaldata } from '../../types/interfaces';
import { AuthContext } from 'auth';

type Props = {
  onClick: (e: any) => void
};

function TableButtons({onClick}: Props) {
  const navigate = useNavigate();
  const [personal, setPersonal] = React.useState<personaldata[]>([]);
  const [education, setEducation] = React.useState<educationdata[]>([]);
  const [employment, setEmployment] = React.useState<employmentdata[]>([]);
  const [update, setUpdate] = React.useState<idprocessed[]>([]);
  const [uidToFullNameMap, setUidToFullNameMap] = React.useState<Record<string, string>>({});
  const {currentUser} =  React.useContext(AuthContext)
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchuser: admindata[] = await fetchadmindata(currentUser?.uid || '') || [];
        const userschool = fetchuser[0].school
        const personalResult: personaldata[] = await fetchallpersonalinfo() || [];
        const filterpersonalResult = personalResult.filter((item) => item.school == userschool)
        setPersonal(filterpersonalResult);

        const educationResult: educationdata[] = await fetchalleducation() || [];
        const filtereducationResult = educationResult.filter((item) => item.school == userschool)

        setEducation(filtereducationResult);

        const employmentResult: employmentdata[] = await fetchallemployment() || [];
        const filteremploymentResult = employmentResult.filter((item) => item.school == userschool)

        setEmployment(filteremploymentResult);
        
        const updateResult: id[] = await fetchupdate() || [];
        console.log(updateResult)
        const processedUpdate = updateResult.map(item => {
          console.log(item)
          const timestampInSeconds = item.date.seconds;
          const timestampInMilliseconds = timestampInSeconds * 1000; // Convert seconds to milliseconds
          const dateObject = new Date(timestampInMilliseconds);
        
          // Format the date as MM-DD-YYYY
          const formattedDate = dateObject.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        
          // Update the item with the formatted date
          return {
            ...item,
            formattedDate: formattedDate,
          };
        });
        
        console.log(processedUpdate)
        const updateWithoutDate = processedUpdate.map(({ date, ...rest }) => rest);
        setUpdate(updateWithoutDate);
        console.log(updateWithoutDate)

        const uidMap: Record<string, string> = {};

        filterpersonalResult.forEach((person) => {
          uidMap[person.uid] = person.name;
        });

        setUidToFullNameMap(uidMap);
      } catch (error) {
        console.error(error)
      }
    };

    fetchData();
  }, []);

  const openTable = (data: any, headers: { name: string; id: string }[], title: string) => {
    navigate('/alumni/table', { state: { data, headers, title } });
  };

  const educationDataWithFullNames = education.map((edu) => ({
    ...edu,
    fullname: uidToFullNameMap[edu.uid],
  }));

  const employmentDataWithFUllNames = employment.map((emp) => ({
    ...emp,
    fullname: uidToFullNameMap[emp.uid],
  }));

  const updateDataWithFullName = update.map((emp) => ({
    
    ...emp,
    fullname: uidToFullNameMap[emp.uid],
  }));


  const updateEmploymentState = () => {
      setEmployment(employmentDataWithFUllNames)
  }
  const updateEducationState = () => {
    setEducation(educationDataWithFullNames);
  };

  const updateUpdateState = () => {
    console.log(updateDataWithFullName)

    setUpdate(updateDataWithFullName);
  };

  return (
    <div className="table-buttons-container">
      <h2>Alumni Management</h2>
      <TableButton
        title="Alumni Personal Details"
        onClick={() =>
          openTable(
            personal,
            [
              { name: 'Full Name', id: 'name' },
              { name: 'Birthdate', id: 'birthdate' },
              { name: 'Civil Status', id: 'civilstatus' },
              { name: 'Email', id: 'email' },
              { name: 'Social Media', id: 'social' },
              { name: 'Age', id: 'age' },
              { name: 'Gender', id: 'sex' },
              { name: 'Address', id: 'address' },
              { name: 'Batch', id: 'sy' },
            ],
            'Alumni Personal Details'
          )
        }
      />
      <TableButton
        title="Alumni Educational Status"
        onClick={() => {
          openTable(
            educationDataWithFullNames,
            [
              { name: 'Full Name', id: 'fullname' }, 
              { name: 'School', id: 'school' },
              { name: 'ID number', id: 'schoolid' },
              { name: 'Batch Year', id: 'sy' },
              { name: 'Higher Education', id: 'highered' },
              { name: 'Course', id: 'course' },
              { name: 'Take Board Exam', id: 'exam' },
              { name: 'Top Notcher', id: 'topnotcher' },
              { name: 'Top Notcher Rank', id: 'rank' },
            ],
            'Alumni Education Details'
          );
          updateEducationState();
        }}
      />
      <TableButton 
        title="Alumni Employment Status" 
        onClick={() => {
          openTable(employmentDataWithFUllNames, 
            [
              { name: 'Full Name', id: 'fullname' }, 
              { name: 'Employed', id: 'employee' },
              { name: 'Current Work', id: 'currentwork' },
              { name: 'Salary Range', id: 'salary' },
              { name: 'Work History', id: 'history.work' },  
            ],
            'Alumni Employment Details'
            );
            updateEmploymentState();
        }} 
      />
      <TableButton 
      title="Alumni Updated Profile" 
      onClick={() => {
        openTable(updateDataWithFullName, 
          [
            { name: 'Full Name', id: 'fullname' }, 
            { name: 'Date', id: 'formattedDate' },
          ],
          'Alumni Updated Profiles'
          );
          updateUpdateState();
      }}  
      />
      <TableButton title="Add New Alumni Member" onClick={onClick} />
    </div>
  );
}

export default TableButtons;
