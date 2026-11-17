export function compareMetadata(before, after) {
  return Object.keys(before.metadata).map(id => {
    const a=before.metadata[id], b=after.metadata[id];
    let status='unverifiable';
    if(a.status==='not-found'&&b.status==='not-found')status='not-found';
    else if(a.status==='found'&&b.status==='not-found')status='removed';
    else if(id==='orientation'&&a.status==='found'&&b.status==='found'&&a.value===b.value)status='preserved';
    return {id,label:a.label,before:a.value,after:b.value,status};
  });
}
export function orientationMatrix(orientation,width,height) {
  const matrices={1:[1,0,0,1,0,0],2:[-1,0,0,1,width,0],3:[-1,0,0,-1,width,height],4:[1,0,0,-1,0,height],5:[0,1,1,0,0,0],6:[0,1,-1,0,height,0],7:[0,-1,-1,0,height,width],8:[0,-1,1,0,0,width]};
  return matrices[orientation];
}
