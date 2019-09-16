import React from 'react';

import NavBar from 'src/components/Nav/NavBar';
import AnswerCard from 'src/components/Answers/AnswerCard';
import Api from 'src/utils/Api';
import { useMount, useSetState } from 'react-use';

const QuestionAnswer = props => {
  const id = props.match.params.id;
  const state = props.location.state;
  const [data, setData] = useSetState({});

  // if (!state) {
  //   return <Redirect to="/" />;
  // }

  const fetchData = async () => {
    const { data } = await Api.post('/my/answer/info', { explain_id: id });
    setData({
      id: data.explain_id,
      content: data.content,
      attach: data.attachment
    });
  };

  useMount(() => {
    fetchData();
  });

  return (
    <div style={{ background: '#fff', overflow: 'hidden' }}>
      <NavBar title="查看回答" />
      {state ? (
        <AnswerCard
          {...state}
          style={{ marginTop: 0 }}
          title={null}
          folding={false}
          attachShow={true}
        />
      ) : (
        <AnswerCard
          {...data}
          style={{ marginTop: 0 }}
          battery={0}
          message={null}
          title={null}
          folding={false}
          attachShow={true}
        />
      )}
    </div>
  );
};

export default QuestionAnswer;
