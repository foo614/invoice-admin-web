import React, { useState } from 'react';
import { Typography } from 'antd';

const ExpandableJsonCell = ({ text }: { text: any }) => {
  const [expanded, setExpanded] = useState(false);

  const formattedJson = typeof text === 'string' ? text : JSON.stringify(text, null, 2); // format the JSON object nicely

  const maxLength = 200; // limit preview length
  const isLong = formattedJson.length > maxLength;

  return (
    <div>
      <Typography.Paragraph
        style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}
        ellipsis={expanded ? false : { rows: 3, expandable: false }}
      >
        {expanded
          ? formattedJson
          : `${formattedJson.substring(0, maxLength)}${isLong ? '...' : ''}`}
      </Typography.Paragraph>

      {isLong && (
        <a onClick={() => setExpanded(!expanded)}>{expanded ? 'Show Less' : 'Show More'}</a>
      )}
    </div>
  );
};

export default ExpandableJsonCell;
