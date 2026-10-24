exec(bpy.data.texts['BSD_BUILD_LIB'].as_string())
# 기존 이든의 관절 구조를 복제하고 대표 캐릭터의 고유 의상을 입힌다.
source=bpy.data.objects['CHAR_eden'];copies={}
def copy_tree(obj,parent=None):
 new=obj.copy()
 if obj.data:new.data=obj.data.copy()
 new.name=obj.name.replace('eden','kyu');bpy.context.collection.objects.link(new);new.parent=parent;copies[obj.name]=new
 for child in obj.children:copy_tree(child,new)
 return new
owner=copy_tree(source);owner.location=(-.2,-1.55,.05)
black=mat('Kyu_black','20272c',.75);blue=mat('Kyu_blue','0964be',.55);denim=mat('Kyu_denim','263c50',.82);silver=mat('Kyu_silver','bac5cf',.26,.8);white=mat('Sneaker_ivory','eeeae2',.65)
for old,new in copies.items():
 if new.type=='MESH':
  for i,m in enumerate(new.data.materials):
   if m.name.startswith('eden_jacket'):new.data.materials[i]=black
   elif m.name.startswith('Trouser'):new.data.materials[i]=denim
head=copies['eden_head'];body=copies['eden_body']
# 야구 모자는 연속된 돔과 납작한 챙, 봉제선으로 구성
verts=[];faces=[];segments=40;rings=10
for r in range(rings+1):
 theta=.01+r/rings*1.25
 for j in range(segments):
  a=j*math.tau/segments;verts.append((.35*math.sin(theta)*math.cos(a),.32*math.sin(theta)*math.sin(a)+.02,.37*math.cos(theta)+.08))
for r in range(rings):
 for j in range(segments):a=r*segments+j;b=r*segments+(j+1)%segments;faces.append((a,b,b+segments,a+segments))
mesh=bpy.data.meshes.new('Kyu cap mesh');mesh.from_pydata(verts,[],faces);mesh.materials.append(blue);mesh.update()
cap=bpy.data.objects.new('kyu_cap',mesh);bpy.context.collection.objects.link(cap);cap.parent=head
for p in mesh.polygons:p.use_smooth=True
brim=uv('kyu_cap_brim',(0,-.32,.21),(.36,.27,.035),blue);brim.parent=head
for side in [-1,1]:
 pts=[(side*.17*math.sin(t*math.pi/20),-.31*math.sin(t*math.pi/20),.38*math.cos(t*math.pi/20)+.08) for t in range(1,9)]
 ob=line('kyu_cap_seam',pts,.003,white);ob.parent=head
button=uv('kyu_cap_button',(0,.02,.45),(.03,.03,.015),blue);button.parent=head
mark=txt('kyu_cap_mark','+', (0,-.285,.30),.12,white);mark.parent=head
bag=cube('kyu_backpack',(0,.21,.95),(.37,.22,.39),black,.09);bag.parent=body
for side in [-1,1]:
 ob=line('kyu_backpack_strap',[(side*.17,.18,.83),(side*.2,-.02,1.12),(side*.15,-.15,1.09)],.02,black);ob.parent=body
pts=[(.24+math.cos(i*math.tau/32)*.06,-.07,.69+math.sin(i*math.tau/32)*.06) for i in range(33)]
ring=line('kyu_keyring',pts,.009,silver);ring.parent=body
# 입구 엘리베이터: 매입된 문, 얇은 조명 틈, 호출 패널
steel=mat('Elevator_steel','65778b',.27,.65);ink=mat('Graphite','242c31',.42,.25);led=mat('Warm_LED','ffe6b5',.3,0,4)
cube('PRP_elevator_body',(-4.35,-5.7,1.3),(1.9,.75,2.6),steel,.08)
cube('PRP_elevator_recess',(-4.35,-6.09,1.15),(1.4,.025,2.2),ink,.02)
for side in [-1,1]:
 cube('PRP_elevator_door',(-4.35+side*.335,-6.12,1.12),(.655,.03,2.13),steel,.02)
 cube('PRP_elevator_strip',(-4.35+side*.75,-6.13,1.2),(.025,.02,2.25),led,.005)
cube('PRP_elevator_call',(-3.55,-6.13,1.25),(.11,.03,.29),ink,.02)
txt('PRP_elevator_floor','18',(-4.35,-6.13,2.34),.13,led)
result={'owner':'CHAR_kyu','brand':'Original logo textures applied in web runtime','objects':len(bpy.data.objects)}
