(module
 (type $0 (func (result i32)))
 (type $1 (func (param f64) (result f64)))
 (type $2 (func))
 (type $3 (func (param i32) (result i32)))
 (type $4 (func (param i32 i32) (result i32)))
 (type $5 (func (param i32 i32 i32 i32)))
 (type $6 (func (param i32 i32 i32) (result i32)))
 (type $7 (func (param i64) (result i32)))
 (type $8 (func (param f32 f32 f32 f32) (result f32)))
 (type $9 (func (param i32 i32 f32)))
 (type $10 (func (param f64 f64 i32) (result f64)))
 (type $11 (func (param f32 f32 f32) (result f32)))
 (type $12 (func (param f32 f32 f32 f32 f32 f32 f32 f32 f32)))
 (type $13 (func (param i32 i32 i32 i32 i32)))
 (type $14 (func (param f32 f32 f32 f32 i32) (result i32)))
 (type $15 (func (param i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/grass/activeGridX (mut i32) (i32.const -999999))
 (global $assembly/grass/activeGridZ (mut i32) (i32.const -999999))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $assembly/grass/matrixBuffer (mut i32) (i32.const 0))
 (global $assembly/grass/positionsBuffer (mut i32) (i32.const 0))
 (global $assembly/grass/indicesBuffer (mut i32) (i32.const 0))
 (global $assembly/grass/clustersBuffer (mut i32) (i32.const 0))
 (global $assembly/grass/fovHelperBuffer (mut i32) (i32.const 0))
 (global $assembly/grass/lastCamDirX (mut f32) (f32.const 0))
 (global $assembly/grass/lastCamDirZ (mut f32) (f32.const -1))
 (global $assembly/grass/lastHalfFovCos (mut f32) (f32.const 0.10000000149011612))
 (global $assembly/grass/headerShaderBuffer (mut i32) (i32.const 0))
 (global $assembly/grass/mainShaderBuffer (mut i32) (i32.const 0))
 (global $assembly/grass/depthShaderBuffer (mut i32) (i32.const 0))
 (global $~lib/math/rempio2_y0 (mut f64) (f64.const 0))
 (global $~lib/math/rempio2_y1 (mut f64) (f64.const 0))
 (global $~lib/math/res128_hi (mut i64) (i64.const 0))
 (global $~argumentsLength (mut i32) (i32.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 6032))
 (memory $0 100 512)
 (data $0 (i32.const 1036) ",")
 (data $0.1 (i32.const 1048) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data $1 (i32.const 1084) "<")
 (data $1.1 (i32.const 1096) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data $2 (i32.const 1148) "<")
 (data $2.1 (i32.const 1160) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $3 (i32.const 1212) "<")
 (data $3.1 (i32.const 1224) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00s\00t\00u\00b\00.\00t\00s")
 (data $4 (i32.const 1280) "n\83\f9\a2\00\00\00\00\d1W\'\fc)\15DN\99\95b\db\c0\dd4\f5\abcQ\feA\90C<:n$\b7a\c5\bb\de\ea.I\06\e0\d2MB\1c\eb\1d\fe\1c\92\d1\t\f55\82\e8>\a7)\b1&p\9c\e9\84D\bb.9\d6\919A~_\b4\8b_\84\9c\f49S\83\ff\97\f8\1f;(\f9\bd\8b\11/\ef\0f\98\05\de\cf~6m\1fm\nZf?FO\b7\t\cb\'\c7\ba\'u-\ea_\9e\f79\07={\f1\e5\eb\b1_\fbk\ea\92R\8aF0\03V\08]\8d\1f \bc\cf\f0\abk{\fca\91\e3\a9\1d6\f4\9a_\85\99e\08\1b\e6^\80\d8\ff\8d@h\a0\14W\15\06\061\'sM")
 (data $5 (i32.const 1484) "<")
 (data $5.1 (i32.const 1496) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data $6 (i32.const 1548) "<")
 (data $6.1 (i32.const 1560) "\02\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $7 (i32.const 1612) "L")
 (data $7.1 (i32.const 1624) "\01\00\00\000\00\00\00\00\00\01\00\02\00\02\00\01\00\03\00\04\00\05\00\06\00\06\00\05\00\07\00\08\00\t\00\n\00\n\00\t\00\0b\00\0c\00\r\00\0e\00\0e\00\r\00\0f")
 (data $8 (i32.const 1692) ",")
 (data $8.1 (i32.const 1704) "\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $9 (i32.const 1740) "\9c\01")
 (data $9.1 (i32.const 1752) "\02\00\00\00\8a\01\00\00a\00t\00t\00r\00i\00b\00u\00t\00e\00 \00f\00l\00o\00a\00t\00 \00a\00C\00l\00u\00s\00t\00e\00r\00;\00\n\00u\00n\00i\00f\00o\00r\00m\00 \00v\00e\00c\003\00 \00u\00P\00l\00a\00y\00e\00r\00P\00o\00s\00;\00\n\00u\00n\00i\00f\00o\00r\00m\00 \00v\00e\00c\003\00 \00u\00C\00a\00m\00P\00o\00s\00;\00\n\00u\00n\00i\00f\00o\00r\00m\00 \00v\00e\00c\003\00 \00u\00C\00a\00m\00D\00i\00r\00;\00\n\00u\00n\00i\00f\00o\00r\00m\00 \00f\00l\00o\00a\00t\00 \00u\00H\00a\00l\00f\00F\00o\00v\00C\00o\00s\00;\00\n\00u\00n\00i\00f\00o\00r\00m\00 \00f\00l\00o\00a\00t\00 \00u\00T\00i\00m\00e\00;\00\n\00u\00n\00i\00f\00o\00r\00m\00 \00f\00l\00o\00a\00t\00 \00u\00M\00a\00x\00V\00i\00s\00D\00i\00s\00t\00;\00\n\00u\00n\00i\00f\00o\00r\00m\00 \00f\00l\00o\00a\00t\00 \00u\00B\00e\00n\00d\00R\00a\00d\00i\00u\00s\00;\00\n")
 (data $10 (i32.const 2156) "\ac")
 (data $10.1 (i32.const 2168) "\02\00\00\00\8e\00\00\00i\00f\00 \00(\00d\00i\00s\00t\00T\00o\00C\00a\00m\00 \00>\00 \001\004\000\000\00.\000\00)\00 \00{\00 \00f\00a\00d\00e\00A\00l\00p\00h\00a\00 \00=\00 \000\00.\000\00;\00 \00}\00\n\00t\00r\00a\00n\00s\00f\00o\00r\00m\00e\00d\00 \00*\00=\00 \00f\00a\00d\00e\00A\00l\00p\00h\00a\00;\00\n")
 (data $11 (i32.const 2332) "L")
 (data $11.1 (i32.const 2344) "\02\00\00\004\00\00\00t\00r\00a\00n\00s\00f\00o\00r\00m\00e\00d\00 \00*\00=\00 \00f\00a\00d\00e\00A\00l\00p\00h\00a\00;\00\n")
 (data $12 (i32.const 2412) "L")
 (data $12.1 (i32.const 2424) "\02\00\00\000\00\00\00#\00i\00n\00c\00l\00u\00d\00e\00 \00<\00b\00e\00g\00i\00n\00_\00v\00e\00r\00t\00e\00x\00>\00\n")
 (data $13 (i32.const 2492) "L\01")
 (data $13.1 (i32.const 2504) "\02\00\00\00<\01\00\00#\00i\00f\00d\00e\00f\00 \00U\00S\00E\00_\00I\00N\00S\00T\00A\00N\00C\00I\00N\00G\00\n\00v\00e\00c\004\00 \00i\00n\00s\00t\00W\00o\00r\00l\00d\00P\00o\00s\00 \00=\00 \00i\00n\00s\00t\00a\00n\00c\00e\00M\00a\00t\00r\00i\00x\00 \00*\00 \00v\00e\00c\004\00(\000\00.\000\00,\00 \000\00.\000\00,\00 \000\00.\000\00,\00 \001\00.\000\00)\00;\00\n\00#\00e\00l\00s\00e\00\n\00v\00e\00c\004\00 \00i\00n\00s\00t\00W\00o\00r\00l\00d\00P\00o\00s\00 \00=\00 \00m\00o\00d\00e\00l\00M\00a\00t\00r\00i\00x\00 \00*\00 \00v\00e\00c\004\00(\000\00.\000\00,\00 \000\00.\000\00,\00 \000\00.\000\00,\00 \001\00.\000\00)\00;\00\n\00#\00e\00n\00d\00i\00f\00\n")
 (data $14 (i32.const 2828) "\1c")
 (data $14.1 (i32.const 2840) "\02")
 (data $15 (i32.const 2860) "<\01")
 (data $15.1 (i32.const 2872) "\02\00\00\00(\01\00\00v\00e\00c\002\00 \00d\00i\00r\00F\00r\00o\00m\00C\00a\00m\00 \00=\00 \00i\00n\00s\00t\00W\00o\00r\00l\00d\00P\00o\00s\00.\00x\00z\00 \00-\00 \00u\00C\00a\00m\00P\00o\00s\00.\00x\00z\00;\00\n\00f\00l\00o\00a\00t\00 \00d\00i\00s\00t\00T\00o\00C\00a\00m\00 \00=\00 \00l\00e\00n\00g\00t\00h\00(\00d\00i\00r\00F\00r\00o\00m\00C\00a\00m\00)\00;\00\n\00f\00l\00o\00a\00t\00 \00d\00i\00s\00t\00T\00o\00P\00l\00a\00y\00e\00r\00 \00=\00 \00l\00e\00n\00g\00t\00h\00(\00i\00n\00s\00t\00W\00o\00r\00l\00d\00P\00o\00s\00.\00x\00z\00 \00-\00 \00u\00P\00l\00a\00y\00e\00r\00P\00o\00s\00.\00x\00z\00)\00;\00\n")
 (data $16 (i32.const 3180) "l\01")
 (data $16.1 (i32.const 3192) "\02\00\00\00\\\01\00\00i\00f\00 \00(\00a\00C\00l\00u\00s\00t\00e\00r\00 \00>\00 \000\00.\005\00)\00 \00{\00\n\00f\00l\00o\00a\00t\00 \00c\002\00S\00c\00a\00l\00e\00 \00=\00 \00s\00m\00o\00o\00t\00h\00s\00t\00e\00p\00(\003\000\000\00.\000\00,\00 \005\000\00.\000\00,\00 \00d\00i\00s\00t\00T\00o\00C\00a\00m\00)\00;\00\n\00v\00e\00c\003\00 \00c\002\00C\00e\00n\00t\00e\00r\00 \00=\00 \00v\00e\00c\003\00(\001\00.\008\00,\00 \000\00.\000\00,\00 \001\00.\008\00)\00;\00\n\00t\00r\00a\00n\00s\00f\00o\00r\00m\00e\00d\00 \00=\00 \00c\002\00C\00e\00n\00t\00e\00r\00 \00+\00 \00(\00t\00r\00a\00n\00s\00f\00o\00r\00m\00e\00d\00 \00-\00 \00c\002\00C\00e\00n\00t\00e\00r\00)\00 \00*\00 \00c\002\00S\00c\00a\00l\00e\00;\00\n\00}\00\n")
 (data $17 (i32.const 3548) "\cc\01")
 (data $17.1 (i32.const 3560) "\02\00\00\00\b2\01\00\00f\00l\00o\00a\00t\00 \00i\00n\00n\00e\00r\00D\00i\00s\00t\00 \00=\00 \00u\00M\00a\00x\00V\00i\00s\00D\00i\00s\00t\00 \00*\00 \000\00.\005\007\00;\00\n\00f\00l\00o\00a\00t\00 \00f\00a\00d\00e\00A\00l\00p\00h\00a\00 \00=\00 \001\00.\000\00;\00\n\00i\00f\00 \00(\00d\00i\00s\00t\00T\00o\00C\00a\00m\00 \00>\00 \00i\00n\00n\00e\00r\00D\00i\00s\00t\00)\00 \00{\00\n\00f\00l\00o\00a\00t\00 \00t\00 \00=\00 \00c\00l\00a\00m\00p\00(\00(\00d\00i\00s\00t\00T\00o\00C\00a\00m\00 \00-\00 \00i\00n\00n\00e\00r\00D\00i\00s\00t\00)\00 \00/\00 \00(\00u\00M\00a\00x\00V\00i\00s\00D\00i\00s\00t\00 \00-\00 \00i\00n\00n\00e\00r\00D\00i\00s\00t\00)\00,\00 \000\00.\000\00,\00 \001\00.\000\00)\00;\00\n\00f\00a\00d\00e\00A\00l\00p\00h\00a\00 \00=\00 \001\00.\000\00 \00-\00 \00(\00t\00 \00*\00 \00t\00 \00*\00 \00(\003\00.\000\00 \00-\00 \002\00.\000\00 \00*\00 \00t\00)\00)\00;\00\n\00}\00\n")
 (data $18 (i32.const 4012) "\ec\01")
 (data $18.1 (i32.const 4024) "\02\00\00\00\ce\01\00\00i\00f\00 \00(\00d\00i\00s\00t\00T\00o\00C\00a\00m\00 \00>\00 \001\000\00.\000\00)\00 \00{\00\n\00v\00e\00c\002\00 \00n\00o\00r\00m\00D\00i\00r\00 \00=\00 \00d\00i\00r\00F\00r\00o\00m\00C\00a\00m\00 \00/\00 \00d\00i\00s\00t\00T\00o\00C\00a\00m\00;\00\n\00f\00l\00o\00a\00t\00 \00d\00o\00t\00C\00a\00m\00 \00=\00 \00d\00o\00t\00(\00n\00o\00r\00m\00D\00i\00r\00,\00 \00u\00C\00a\00m\00D\00i\00r\00.\00x\00z\00)\00;\00\n\00i\00f\00 \00(\00d\00o\00t\00C\00a\00m\00 \00<\00 \00u\00H\00a\00l\00f\00F\00o\00v\00C\00o\00s\00)\00 \00{\00\n\00f\00l\00o\00a\00t\00 \00f\00o\00v\00F\00a\00d\00e\00 \00=\00 \00c\00l\00a\00m\00p\00(\00(\00d\00o\00t\00C\00a\00m\00 \00-\00 \00(\00u\00H\00a\00l\00f\00F\00o\00v\00C\00o\00s\00 \00-\00 \000\00.\002\005\00)\00)\00 \00/\00 \000\00.\002\005\00,\00 \000\00.\000\00,\00 \001\00.\000\00)\00;\00\n\00f\00a\00d\00e\00A\00l\00p\00h\00a\00 \00*\00=\00 \00f\00o\00v\00F\00a\00d\00e\00;\00\n\00}\00\n\00}\00\n")
 (data $19 (i32.const 4508) "\8c")
 (data $19.1 (i32.const 4520) "\02\00\00\00r\00\00\00f\00l\00o\00a\00t\00 \00h\00e\00i\00g\00h\00t\00F\00a\00c\00t\00o\00r\00 \00=\00 \00c\00l\00a\00m\00p\00(\00p\00o\00s\00i\00t\00i\00o\00n\00.\00y\00 \00/\00 \001\000\00.\000\00,\00 \000\00.\000\00,\00 \001\00.\000\00)\00;\00\n")
 (data $20 (i32.const 4652) "\\\01")
 (data $20.1 (i32.const 4664) "\02\00\00\00>\01\00\00i\00f\00 \00(\00d\00i\00s\00t\00T\00o\00C\00a\00m\00 \00<\00 \006\000\000\00.\000\00)\00 \00{\00\n\00f\00l\00o\00a\00t\00 \00w\00i\00n\00d\00S\00w\00a\00y\00 \00=\00 \00s\00i\00n\00(\00u\00T\00i\00m\00e\00 \00*\00 \002\00.\008\00 \00+\00 \00i\00n\00s\00t\00W\00o\00r\00l\00d\00P\00o\00s\00.\00x\00 \00*\00 \000\00.\000\008\00 \00+\00 \00i\00n\00s\00t\00W\00o\00r\00l\00d\00P\00o\00s\00.\00z\00 \00*\00 \000\00.\000\008\00)\00 \00*\00 \000\00.\004\005\00 \00*\00 \00h\00e\00i\00g\00h\00t\00F\00a\00c\00t\00o\00r\00;\00\n\00t\00r\00a\00n\00s\00f\00o\00r\00m\00e\00d\00.\00x\00 \00+\00=\00 \00w\00i\00n\00d\00S\00w\00a\00y\00;\00\n\00}\00\n")
 (data $21 (i32.const 5004) "\cc\02")
 (data $21.1 (i32.const 5016) "\02\00\00\00\b8\02\00\00i\00f\00 \00(\00d\00i\00s\00t\00T\00o\00P\00l\00a\00y\00e\00r\00 \00<\00 \00u\00B\00e\00n\00d\00R\00a\00d\00i\00u\00s\00 \00&\00&\00 \00a\00b\00s\00(\00i\00n\00s\00t\00W\00o\00r\00l\00d\00P\00o\00s\00.\00y\00 \00-\00 \00u\00P\00l\00a\00y\00e\00r\00P\00o\00s\00.\00y\00)\00 \00<\00 \002\005\00.\000\00)\00 \00{\00\n\00v\00e\00c\002\00 \00p\00u\00s\00h\00D\00i\00r\00 \00=\00 \00n\00o\00r\00m\00a\00l\00i\00z\00e\00(\00i\00n\00s\00t\00W\00o\00r\00l\00d\00P\00o\00s\00.\00x\00z\00 \00-\00 \00u\00P\00l\00a\00y\00e\00r\00P\00o\00s\00.\00x\00z\00 \00+\00 \00v\00e\00c\002\00(\000\00.\000\000\000\001\00)\00)\00;\00\n\00f\00l\00o\00a\00t\00 \00b\00e\00n\00d\00F\00a\00c\00t\00o\00r\00 \00=\00 \00(\001\00.\000\00 \00-\00 \00d\00i\00s\00t\00T\00o\00P\00l\00a\00y\00e\00r\00 \00/\00 \00u\00B\00e\00n\00d\00R\00a\00d\00i\00u\00s\00)\00 \00*\00 \004\00.\005\00 \00*\00 \00h\00e\00i\00g\00h\00t\00F\00a\00c\00t\00o\00r\00;\00\n\00t\00r\00a\00n\00s\00f\00o\00r\00m\00e\00d\00.\00x\00 \00+\00=\00 \00p\00u\00s\00h\00D\00i\00r\00.\00x\00 \00*\00 \00b\00e\00n\00d\00F\00a\00c\00t\00o\00r\00;\00\n\00t\00r\00a\00n\00s\00f\00o\00r\00m\00e\00d\00.\00z\00 \00+\00=\00 \00p\00u\00s\00h\00D\00i\00r\00.\00y\00 \00*\00 \00b\00e\00n\00d\00F\00a\00c\00t\00o\00r\00;\00\n\00t\00r\00a\00n\00s\00f\00o\00r\00m\00e\00d\00.\00y\00 \00-\00=\00 \00b\00e\00n\00d\00F\00a\00c\00t\00o\00r\00 \00*\00 \000\00.\003\00;\00\n\00}\00\n")
 (data $22 (i32.const 5724) "<")
 (data $22.1 (i32.const 5736) "\02\00\00\00$\00\00\00U\00n\00p\00a\00i\00r\00e\00d\00 \00s\00u\00r\00r\00o\00g\00a\00t\00e")
 (data $23 (i32.const 5788) ",")
 (data $23.1 (i32.const 5800) "\02\00\00\00\1c\00\00\00~\00l\00i\00b\00/\00s\00t\00r\00i\00n\00g\00.\00t\00s")
 (data $24 (i32.const 5836) "|")
 (data $24.1 (i32.const 5848) "\02\00\00\00^\00\00\00U\00n\00e\00x\00p\00e\00c\00t\00e\00d\00 \00\'\00n\00u\00l\00l\00\'\00 \00(\00n\00o\00t\00 \00a\00s\00s\00i\00g\00n\00e\00d\00 \00o\00r\00 \00f\00a\00i\00l\00e\00d\00 \00c\00a\00s\00t\00)")
 (data $25 (i32.const 5964) "<")
 (data $25.1 (i32.const 5976) "\02\00\00\00\"\00\00\00a\00s\00s\00e\00m\00b\00l\00y\00/\00g\00r\00a\00s\00s\00.\00t\00s")
 (data $26 (i32.const 6032) "\t\00\00\00 \00\00\00 \00\00\00 \00\00\00\00\00\00\00\01\19\00\00\81\00\00\00A\00\00\00\82\00\00\00\02\t")
 (export "lastCamDirX" (global $assembly/grass/lastCamDirX))
 (export "lastCamDirZ" (global $assembly/grass/lastCamDirZ))
 (export "lastHalfFovCos" (global $assembly/grass/lastHalfFovCos))
 (export "hash2D" (func $assembly/grass/hash2D))
 (export "initGrassBladeGeometry" (func $assembly/grass/initGrassBladeGeometry))
 (export "getGrassHeaderShaderWasm" (func $assembly/grass/getGrassHeaderShaderWasm))
 (export "getGrassTransformShaderWasm" (func $assembly/grass/getGrassTransformShaderWasm))
 (export "initGrassShadersWasm" (func $assembly/grass/initGrassShadersWasm))
 (export "getHeaderShaderPointer" (func $assembly/grass/getHeaderShaderPointer))
 (export "getHeaderShaderLength" (func $assembly/grass/getHeaderShaderLength))
 (export "getMainShaderPointer" (func $assembly/grass/getMainShaderPointer))
 (export "getMainShaderLength" (func $assembly/grass/getMainShaderLength))
 (export "getDepthShaderPointer" (func $assembly/grass/getDepthShaderPointer))
 (export "getDepthShaderLength" (func $assembly/grass/getDepthShaderLength))
 (export "getPositionsPointer" (func $assembly/grass/getPositionsPointer))
 (export "getIndicesPointer" (func $assembly/grass/getIndicesPointer))
 (export "getClustersPointer" (func $assembly/grass/getClustersPointer))
 (export "getMatrixBufferPointer" (func $assembly/grass/getMatrixBufferPointer))
 (export "getFovHelperBufferPointer" (func $assembly/grass/getFovHelperBufferPointer))
 (export "computeCamParamsWasm" (func $assembly/grass/computeCamParamsWasm))
 (export "computeFovHelperLinesWasm" (func $assembly/grass/computeFovHelperLinesWasm))
 (export "updateRollingGridWasm" (func $assembly/grass/updateRollingGridWasm))
 (export "__new" (func $~lib/rt/stub/__new))
 (export "__pin" (func $~lib/rt/stub/__pin))
 (export "__unpin" (func $~lib/rt/stub/__unpin))
 (export "__collect" (func $~lib/rt/stub/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/stub/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $0
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 1168
   i32.const 1232
   i32.const 86
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 16
  i32.add
  local.tee $4
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1168
   i32.const 1232
   i32.const 33
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/stub/offset
  local.set $3
  global.get $~lib/rt/stub/offset
  i32.const 4
  i32.add
  local.tee $2
  local.get $4
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.tee $4
  i32.add
  local.tee $5
  memory.size
  local.tee $6
  i32.const 16
  i32.shl
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $7
  i32.gt_u
  if
   local.get $6
   local.get $5
   local.get $7
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $7
   local.get $6
   local.get $7
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $7
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $5
  global.set $~lib/rt/stub/offset
  local.get $3
  local.get $4
  i32.store
  local.get $2
  i32.const 4
  i32.sub
  local.tee $3
  i32.const 0
  i32.store offset=4
  local.get $3
  i32.const 0
  i32.store offset=8
  local.get $3
  local.get $1
  i32.store offset=12
  local.get $3
  local.get $0
  i32.store offset=16
  local.get $2
  i32.const 16
  i32.add
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 3
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $1
  i32.const 1073741820
  local.get $2
  i32.shr_u
  i32.gt_u
  if
   i32.const 1056
   i32.const 1104
   i32.const 19
   i32.const 57
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $2
  i32.shl
  local.tee $1
  i32.const 1
  call $~lib/rt/stub/__new
  local.tee $2
  i32.const 0
  local.get $1
  memory.fill
  local.get $0
  local.get $2
  i32.store
  local.get $0
  local.get $2
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
 )
 (func $~lib/math/pio2_large_quot (param $0 i64) (result i32)
  (local $1 i64)
  (local $2 i64)
  (local $3 i64)
  (local $4 i32)
  (local $5 f64)
  (local $6 i64)
  (local $7 i64)
  (local $8 i64)
  (local $9 i64)
  (local $10 i64)
  (local $11 i64)
  (local $12 i64)
  local.get $0
  i64.const 9223372036854775807
  i64.and
  i64.const 52
  i64.shr_u
  i64.const 1045
  i64.sub
  local.tee $1
  i64.const 63
  i64.and
  local.set $6
  local.get $1
  i64.const 6
  i64.shr_s
  i32.wrap_i64
  i32.const 3
  i32.shl
  i32.const 1280
  i32.add
  local.tee $4
  i64.load
  local.set $3
  local.get $4
  i64.load offset=8
  local.set $2
  local.get $4
  i64.load offset=16
  local.set $1
  local.get $6
  i64.const 0
  i64.ne
  if
   local.get $3
   local.get $6
   i64.shl
   local.get $2
   i64.const 64
   local.get $6
   i64.sub
   local.tee $7
   i64.shr_u
   i64.or
   local.set $3
   local.get $2
   local.get $6
   i64.shl
   local.get $1
   local.get $7
   i64.shr_u
   i64.or
   local.set $2
   local.get $1
   local.get $6
   i64.shl
   local.get $4
   i64.load offset=24
   local.get $7
   i64.shr_u
   i64.or
   local.set $1
  end
  local.get $0
  i64.const 4503599627370495
  i64.and
  i64.const 4503599627370496
  i64.or
  local.tee $6
  i64.const 4294967295
  i64.and
  local.set $7
  local.get $2
  i64.const 4294967295
  i64.and
  local.tee $8
  local.get $6
  i64.const 32
  i64.shr_u
  local.tee $9
  i64.mul
  local.get $2
  i64.const 32
  i64.shr_u
  local.tee $2
  local.get $7
  i64.mul
  local.get $7
  local.get $8
  i64.mul
  local.tee $7
  i64.const 32
  i64.shr_u
  i64.add
  local.tee $8
  i64.const 4294967295
  i64.and
  i64.add
  local.set $10
  local.get $2
  local.get $9
  i64.mul
  local.get $8
  i64.const 32
  i64.shr_u
  i64.add
  local.get $10
  i64.const 32
  i64.shr_u
  i64.add
  global.set $~lib/math/res128_hi
  local.get $9
  local.get $1
  i64.const 32
  i64.shr_u
  i64.mul
  local.tee $1
  local.get $7
  i64.const 4294967295
  i64.and
  local.get $10
  i64.const 32
  i64.shl
  i64.add
  i64.add
  local.tee $2
  local.get $1
  i64.lt_u
  i64.extend_i32_u
  global.get $~lib/math/res128_hi
  local.get $3
  local.get $6
  i64.mul
  i64.add
  i64.add
  local.tee $3
  i64.const 2
  i64.shl
  local.get $2
  i64.const 62
  i64.shr_u
  i64.or
  local.tee $6
  i64.const 63
  i64.shr_s
  local.tee $7
  local.get $2
  i64.const 2
  i64.shl
  i64.xor
  local.set $2
  local.get $6
  local.get $7
  i64.const 1
  i64.shr_s
  i64.xor
  local.tee $1
  i64.clz
  local.set $8
  local.get $1
  local.get $8
  i64.shl
  local.get $2
  i64.const 64
  local.get $8
  i64.sub
  i64.shr_u
  i64.or
  local.tee $9
  i64.const 4294967295
  i64.and
  local.set $1
  local.get $9
  i64.const 32
  i64.shr_u
  local.tee $10
  i64.const 560513588
  i64.mul
  local.get $1
  i64.const 3373259426
  i64.mul
  local.get $1
  i64.const 560513588
  i64.mul
  local.tee $11
  i64.const 32
  i64.shr_u
  i64.add
  local.tee $12
  i64.const 4294967295
  i64.and
  i64.add
  local.set $1
  local.get $10
  i64.const 3373259426
  i64.mul
  local.get $12
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  i64.const 32
  i64.shr_u
  i64.add
  global.set $~lib/math/res128_hi
  local.get $9
  f64.convert_i64_u
  f64.const 3.753184150245214e-04
  f64.mul
  local.get $2
  local.get $8
  i64.shl
  f64.convert_i64_u
  f64.const 3.834951969714103e-04
  f64.mul
  f64.add
  i64.trunc_sat_f64_u
  local.tee $2
  local.get $11
  i64.const 4294967295
  i64.and
  local.get $1
  i64.const 32
  i64.shl
  i64.add
  local.tee $1
  i64.gt_u
  i64.extend_i32_u
  global.get $~lib/math/res128_hi
  local.tee $9
  i64.const 11
  i64.shr_u
  i64.add
  f64.convert_i64_u
  global.set $~lib/math/rempio2_y0
  local.get $9
  i64.const 53
  i64.shl
  local.get $1
  i64.const 11
  i64.shr_u
  i64.or
  local.get $2
  i64.add
  f64.convert_i64_u
  f64.const 5.421010862427522e-20
  f64.mul
  global.set $~lib/math/rempio2_y1
  global.get $~lib/math/rempio2_y0
  i64.const 4372995238176751616
  local.get $8
  i64.const 52
  i64.shl
  i64.sub
  local.get $0
  local.get $6
  i64.xor
  i64.const -9223372036854775808
  i64.and
  i64.or
  f64.reinterpret_i64
  local.tee $5
  f64.mul
  global.set $~lib/math/rempio2_y0
  global.get $~lib/math/rempio2_y1
  local.get $5
  f64.mul
  global.set $~lib/math/rempio2_y1
  local.get $3
  i64.const 62
  i64.shr_s
  local.get $7
  i64.sub
  i32.wrap_i64
 )
 (func $~lib/math/NativeMath.sin (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (local $6 i32)
  (local $7 f64)
  (local $8 f64)
  (local $9 f64)
  local.get $0
  i64.reinterpret_f64
  local.tee $5
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $3
  i32.const 31
  i32.shr_u
  local.set $6
  local.get $3
  i32.const 2147483647
  i32.and
  local.tee $3
  i32.const 1072243195
  i32.le_u
  if
   local.get $3
   i32.const 1045430272
   i32.lt_u
   if
    local.get $0
    return
   end
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $0
   f64.mul
   local.get $1
   local.get $1
   local.get $1
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.const -1.984126982985795e-04
   f64.add
   f64.mul
   f64.const 0.00833333333332249
   f64.add
   local.get $1
   local.get $1
   local.get $1
   f64.mul
   f64.mul
   local.get $1
   f64.const 1.58969099521155e-10
   f64.mul
   f64.const -2.5050760253406863e-08
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.const -0.16666666666666632
   f64.add
   f64.mul
   f64.add
   return
  end
  local.get $3
  i32.const 2146435072
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.sub
   return
  end
  block $~lib/math/rempio2|inlined.0 (result i32)
   local.get $5
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   i32.const 2147483647
   i32.and
   local.tee $4
   i32.const 1073928572
   i32.lt_u
   if
    i32.const 1
    local.set $3
    local.get $6
    if (result f64)
     local.get $0
     f64.const 1.5707963267341256
     f64.add
     local.set $0
     i32.const -1
     local.set $3
     local.get $4
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const 6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const 6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const 6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const 2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const 2.0222662487959506e-21
      f64.add
     end
    else
     local.get $0
     f64.const -1.5707963267341256
     f64.add
     local.set $0
     local.get $4
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const -6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const -6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const -6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const -2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const -2.0222662487959506e-21
      f64.add
     end
    end
    local.set $1
    local.get $0
    global.set $~lib/math/rempio2_y0
    local.get $1
    global.set $~lib/math/rempio2_y1
    local.get $3
    br $~lib/math/rempio2|inlined.0
   end
   local.get $4
   i32.const 1094263291
   i32.lt_u
   if
    local.get $4
    i32.const 20
    i32.shr_u
    local.tee $3
    local.get $0
    local.get $0
    f64.const 0.6366197723675814
    f64.mul
    f64.nearest
    local.tee $7
    f64.const 1.5707963267341256
    f64.mul
    f64.sub
    local.tee $0
    local.get $7
    f64.const 6.077100506506192e-11
    f64.mul
    local.tee $2
    f64.sub
    local.tee $1
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 20
    i32.shr_u
    i32.const 2047
    i32.and
    i32.sub
    i32.const 16
    i32.gt_u
    if
     local.get $7
     f64.const 2.0222662487959506e-21
     f64.mul
     local.get $0
     local.get $0
     local.get $7
     f64.const 6.077100506303966e-11
     f64.mul
     local.tee $1
     f64.sub
     local.tee $0
     f64.sub
     local.get $1
     f64.sub
     f64.sub
     local.set $2
     local.get $3
     local.get $0
     local.get $2
     f64.sub
     local.tee $1
     i64.reinterpret_f64
     i64.const 32
     i64.shr_u
     i32.wrap_i64
     i32.const 20
     i32.shr_u
     i32.const 2047
     i32.and
     i32.sub
     i32.const 49
     i32.gt_u
     if
      local.get $7
      f64.const 8.4784276603689e-32
      f64.mul
      local.get $0
      local.get $0
      local.get $7
      f64.const 2.0222662487111665e-21
      f64.mul
      local.tee $1
      f64.sub
      local.tee $0
      f64.sub
      local.get $1
      f64.sub
      f64.sub
      local.set $2
      local.get $0
      local.get $2
      f64.sub
      local.set $1
     end
    end
    local.get $1
    global.set $~lib/math/rempio2_y0
    local.get $0
    local.get $1
    f64.sub
    local.get $2
    f64.sub
    global.set $~lib/math/rempio2_y1
    local.get $7
    i32.trunc_sat_f64_s
    br $~lib/math/rempio2|inlined.0
   end
   i32.const 0
   local.get $5
   call $~lib/math/pio2_large_quot
   local.tee $3
   i32.sub
   local.get $3
   local.get $6
   select
  end
  local.set $3
  global.get $~lib/math/rempio2_y0
  local.set $2
  global.get $~lib/math/rempio2_y1
  local.set $7
  local.get $3
  i32.const 1
  i32.and
  if (result f64)
   local.get $2
   local.get $2
   f64.mul
   local.tee $0
   local.get $0
   f64.mul
   local.set $1
   f64.const 1
   local.get $0
   f64.const 0.5
   f64.mul
   local.tee $8
   f64.sub
   local.tee $9
   f64.const 1
   local.get $9
   f64.sub
   local.get $8
   f64.sub
   local.get $0
   local.get $0
   local.get $0
   local.get $0
   f64.const 2.480158728947673e-05
   f64.mul
   f64.const -0.001388888888887411
   f64.add
   f64.mul
   f64.const 0.0416666666666666
   f64.add
   f64.mul
   local.get $1
   local.get $1
   f64.mul
   local.get $0
   local.get $0
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.const 2.087572321298175e-09
   f64.add
   f64.mul
   f64.const -2.7557314351390663e-07
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $2
   local.get $7
   f64.mul
   f64.sub
   f64.add
   f64.add
  else
   local.get $2
   local.get $2
   f64.mul
   local.tee $0
   local.get $2
   f64.mul
   local.set $1
   local.get $2
   local.get $0
   local.get $7
   f64.const 0.5
   f64.mul
   local.get $1
   local.get $0
   local.get $0
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.const -1.984126982985795e-04
   f64.add
   f64.mul
   f64.const 0.00833333333332249
   f64.add
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   f64.mul
   local.get $0
   f64.const 1.58969099521155e-10
   f64.mul
   f64.const -2.5050760253406863e-08
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.sub
   f64.mul
   local.get $7
   f64.sub
   local.get $1
   f64.const -0.16666666666666632
   f64.mul
   f64.sub
   f64.sub
  end
  local.tee $0
  f64.neg
  local.get $0
  local.get $3
  i32.const 2
  i32.and
  select
 )
 (func $assembly/grass/hash2D (param $0 f32) (param $1 f32) (param $2 f32) (param $3 f32) (result f32)
  local.get $0
  f32.const 12.989800453186035
  f32.mul
  local.get $1
  f32.const 78.23300170898438
  f32.mul
  f32.add
  local.get $2
  f32.const 43758.546875
  f32.mul
  f32.add
  local.get $3
  f32.const 19.190000534057617
  f32.mul
  f32.add
  f64.promote_f32
  call $~lib/math/NativeMath.sin
  f32.demote_f64
  f32.const 43758.546875
  f32.mul
  local.tee $0
  local.get $0
  f64.promote_f32
  f64.floor
  f32.demote_f64
  f32.sub
 )
 (func $~lib/typedarray/Float32Array#__set (param $0 i32) (param $1 i32) (param $2 f32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1504
   i32.const 1568
   i32.const 1315
   i32.const 64
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  f32.store
 )
 (func $assembly/grass/initGrassBladeGeometry
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $assembly/grass/positionsBuffer
  i32.const 0
  f32.const -1.100000023841858
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 1
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 2
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 3
  f32.const 1.100000023841858
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 4
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 5
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 6
  f32.const -0.2750000059604645
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 7
  f32.const 10
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 8
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 9
  f32.const 0.2750000059604645
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 10
  f32.const 10
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 11
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 12
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 13
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 14
  f32.const -1.100000023841858
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 15
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 16
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 17
  f32.const 1.100000023841858
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 18
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 19
  f32.const 10
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 20
  f32.const -0.2750000059604645
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 21
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 22
  f32.const 10
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 23
  f32.const 0.2750000059604645
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 24
  f32.const 0.6999999284744263
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 25
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 26
  f32.const 1.7999999523162842
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 27
  f32.const 2.9000000953674316
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 28
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 29
  f32.const 1.7999999523162842
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 30
  f32.const 1.524999976158142
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 31
  f32.const 10
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 32
  f32.const 1.7999999523162842
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 33
  f32.const 2.075000047683716
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 34
  f32.const 10
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 35
  f32.const 1.7999999523162842
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 36
  f32.const 1.7999999523162842
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 37
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 38
  f32.const 0.6999999284744263
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 39
  f32.const 1.7999999523162842
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 40
  f32.const 0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 41
  f32.const 2.9000000953674316
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 42
  f32.const 1.7999999523162842
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 43
  f32.const 10
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 44
  f32.const 1.524999976158142
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 45
  f32.const 1.7999999523162842
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 46
  f32.const 10
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/positionsBuffer
  i32.const 47
  f32.const 2.075000047683716
  call $~lib/typedarray/Float32Array#__set
  i32.const 48
  i32.const 1
  call $~lib/rt/stub/__new
  local.tee $3
  i32.const 1632
  i32.const 48
  memory.copy
  i32.const 16
  i32.const 7
  call $~lib/rt/stub/__new
  local.tee $1
  local.get $3
  i32.store
  local.get $1
  local.get $3
  i32.store offset=4
  local.get $1
  i32.const 48
  i32.store offset=8
  local.get $1
  i32.const 24
  i32.store offset=12
  loop $for-loop|0
   local.get $0
   i32.const 24
   i32.lt_s
   if
    global.get $assembly/grass/indicesBuffer
    local.set $4
    local.get $0
    local.get $1
    i32.load offset=12
    i32.ge_u
    if
     i32.const 1504
     i32.const 1712
     i32.const 114
     i32.const 42
     call $~lib/builtins/abort
     unreachable
    end
    local.get $1
    i32.load offset=4
    local.get $0
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    local.set $3
    local.get $0
    local.get $4
    i32.load offset=8
    i32.const 1
    i32.shr_u
    i32.ge_u
    if
     i32.const 1504
     i32.const 1568
     i32.const 605
     i32.const 64
     call $~lib/builtins/abort
     unreachable
    end
    local.get $4
    i32.load offset=4
    local.get $0
    i32.const 1
    i32.shl
    i32.add
    local.get $3
    i32.store16
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  loop $for-loop|1
   local.get $2
   i32.const 8
   i32.lt_s
   if
    global.get $assembly/grass/clustersBuffer
    local.get $2
    f32.const 0
    call $~lib/typedarray/Float32Array#__set
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|1
   end
  end
  i32.const 8
  local.set $0
  loop $for-loop|2
   local.get $0
   i32.const 16
   i32.lt_s
   if
    global.get $assembly/grass/clustersBuffer
    local.get $0
    f32.const 1
    call $~lib/typedarray/Float32Array#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|2
   end
  end
 )
 (func $assembly/grass/getGrassHeaderShaderWasm (result i32)
  i32.const 1760
 )
 (func $~lib/string/String.__concat (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  i32.const 2848
  local.set $2
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const -2
  i32.and
  local.tee $3
  local.get $1
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const -2
  i32.and
  local.tee $4
  i32.add
  local.tee $5
  if
   local.get $5
   i32.const 2
   call $~lib/rt/stub/__new
   local.tee $2
   local.get $0
   local.get $3
   memory.copy
   local.get $2
   local.get $3
   i32.add
   local.get $1
   local.get $4
   memory.copy
  end
  local.get $2
 )
 (func $assembly/grass/getGrassTransformShaderWasm (param $0 i32) (result i32)
  i32.const 2432
  i32.const 2512
  call $~lib/string/String.__concat
  i32.const 2880
  call $~lib/string/String.__concat
  i32.const 3200
  call $~lib/string/String.__concat
  i32.const 3568
  call $~lib/string/String.__concat
  i32.const 4032
  call $~lib/string/String.__concat
  i32.const 2176
  i32.const 2352
  local.get $0
  select
  call $~lib/string/String.__concat
  i32.const 4528
  call $~lib/string/String.__concat
  i32.const 4672
  call $~lib/string/String.__concat
  i32.const 5024
  call $~lib/string/String.__concat
 )
 (func $~lib/string/String.UTF8.encode@varargs (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  block $2of2
   block $outOfRange
    global.get $~argumentsLength
    i32.const 1
    i32.sub
    br_table $2of2 $2of2 $2of2 $outOfRange
   end
   unreachable
  end
  local.get $0
  local.set $2
  local.get $0
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.add
  local.set $3
  loop $while-continue|0
   local.get $2
   local.get $3
   i32.lt_u
   if
    local.get $2
    i32.load16_u
    local.tee $4
    i32.const 128
    i32.lt_u
    if (result i32)
     local.get $1
     i32.const 1
     i32.add
    else
     local.get $4
     i32.const 2048
     i32.lt_u
     if (result i32)
      local.get $1
      i32.const 2
      i32.add
     else
      local.get $4
      i32.const 64512
      i32.and
      i32.const 55296
      i32.eq
      local.get $2
      i32.const 2
      i32.add
      local.get $3
      i32.lt_u
      i32.and
      if
       local.get $2
       i32.load16_u offset=2
       i32.const 64512
       i32.and
       i32.const 56320
       i32.eq
       if
        local.get $1
        i32.const 4
        i32.add
        local.set $1
        local.get $2
        i32.const 4
        i32.add
        local.set $2
        br $while-continue|0
       end
      end
      local.get $1
      i32.const 3
      i32.add
     end
    end
    local.set $1
    local.get $2
    i32.const 2
    i32.add
    local.set $2
    br $while-continue|0
   end
  end
  local.get $1
  i32.const 1
  call $~lib/rt/stub/__new
  local.set $2
  local.get $0
  local.tee $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const -2
  i32.and
  i32.add
  local.set $4
  local.get $2
  local.set $0
  loop $while-continue|00
   local.get $1
   local.get $4
   i32.lt_u
   if
    local.get $1
    i32.load16_u
    local.tee $3
    i32.const 128
    i32.lt_u
    if (result i32)
     local.get $0
     local.get $3
     i32.store8
     local.get $0
     i32.const 1
     i32.add
    else
     local.get $3
     i32.const 2048
     i32.lt_u
     if (result i32)
      local.get $0
      local.get $3
      i32.const 6
      i32.shr_u
      i32.const 192
      i32.or
      local.get $3
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.const 8
      i32.shl
      i32.or
      i32.store16
      local.get $0
      i32.const 2
      i32.add
     else
      local.get $3
      i32.const 63488
      i32.and
      i32.const 55296
      i32.eq
      if
       local.get $3
       i32.const 56320
       i32.lt_u
       local.get $1
       i32.const 2
       i32.add
       local.get $4
       i32.lt_u
       i32.and
       if
        local.get $1
        i32.load16_u offset=2
        local.tee $5
        i32.const 64512
        i32.and
        i32.const 56320
        i32.eq
        if
         local.get $0
         local.get $3
         i32.const 1023
         i32.and
         i32.const 10
         i32.shl
         i32.const 65536
         i32.add
         local.get $5
         i32.const 1023
         i32.and
         i32.or
         local.tee $3
         i32.const 63
         i32.and
         i32.const 128
         i32.or
         i32.const 24
         i32.shl
         local.get $3
         i32.const 6
         i32.shr_u
         i32.const 63
         i32.and
         i32.const 128
         i32.or
         i32.const 16
         i32.shl
         i32.or
         local.get $3
         i32.const 12
         i32.shr_u
         i32.const 63
         i32.and
         i32.const 128
         i32.or
         i32.const 8
         i32.shl
         i32.or
         local.get $3
         i32.const 18
         i32.shr_u
         i32.const 240
         i32.or
         i32.or
         i32.store
         local.get $0
         i32.const 4
         i32.add
         local.set $0
         local.get $1
         i32.const 4
         i32.add
         local.set $1
         br $while-continue|00
        end
       end
      end
      local.get $0
      local.get $3
      i32.const 12
      i32.shr_u
      i32.const 224
      i32.or
      local.get $3
      i32.const 6
      i32.shr_u
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.const 8
      i32.shl
      i32.or
      i32.store16
      local.get $0
      local.get $3
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.store8 offset=2
      local.get $0
      i32.const 3
      i32.add
     end
    end
    local.set $0
    local.get $1
    i32.const 2
    i32.add
    local.set $1
    br $while-continue|00
   end
  end
  local.get $2
 )
 (func $~lib/typedarray/Uint8Array.wrap@varargs (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  block $2of2
   block $1of2
    block $outOfRange
     global.get $~argumentsLength
     i32.const 1
     i32.sub
     br_table $1of2 $1of2 $2of2 $outOfRange
    end
    unreachable
   end
   i32.const -1
   local.set $1
  end
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  local.set $2
  local.get $1
  i32.const 0
  i32.lt_s
  if
   local.get $1
   i32.const -1
   i32.eq
   if (result i32)
    local.get $2
   else
    i32.const 1056
    i32.const 1568
    i32.const 1869
    i32.const 7
    call $~lib/builtins/abort
    unreachable
   end
   local.set $1
  else
   local.get $1
   local.get $2
   i32.gt_s
   if
    i32.const 1056
    i32.const 1568
    i32.const 1874
    i32.const 7
    call $~lib/builtins/abort
    unreachable
   end
  end
  i32.const 12
  i32.const 6
  call $~lib/rt/stub/__new
  local.tee $2
  local.get $0
  i32.store
  local.get $2
  local.get $1
  i32.store offset=8
  local.get $2
  local.get $0
  i32.store offset=4
  local.get $2
 )
 (func $assembly/grass/initGrassShadersWasm
  (local $0 i32)
  i32.const 1
  global.set $~argumentsLength
  i32.const 1760
  call $~lib/string/String.UTF8.encode@varargs
  local.set $0
  i32.const 1
  global.set $~argumentsLength
  local.get $0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  global.set $assembly/grass/headerShaderBuffer
  i32.const 0
  call $assembly/grass/getGrassTransformShaderWasm
  local.set $0
  i32.const 1
  global.set $~argumentsLength
  local.get $0
  call $~lib/string/String.UTF8.encode@varargs
  local.set $0
  i32.const 1
  global.set $~argumentsLength
  local.get $0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  global.set $assembly/grass/mainShaderBuffer
  i32.const 1
  call $assembly/grass/getGrassTransformShaderWasm
  local.set $0
  i32.const 1
  global.set $~argumentsLength
  local.get $0
  call $~lib/string/String.UTF8.encode@varargs
  local.set $0
  i32.const 1
  global.set $~argumentsLength
  local.get $0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  global.set $assembly/grass/depthShaderBuffer
 )
 (func $assembly/grass/getHeaderShaderPointer (result i32)
  (local $0 i32)
  global.get $assembly/grass/headerShaderBuffer
  if (result i32)
   global.get $assembly/grass/headerShaderBuffer
   local.tee $0
   i32.eqz
   if
    i32.const 5856
    i32.const 5984
    i32.const 138
    i32.const 33
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   i32.load offset=4
  else
   i32.const 0
  end
 )
 (func $assembly/grass/getHeaderShaderLength (result i32)
  (local $0 i32)
  global.get $assembly/grass/headerShaderBuffer
  if (result i32)
   global.get $assembly/grass/headerShaderBuffer
   local.tee $0
   i32.eqz
   if
    i32.const 5856
    i32.const 5984
    i32.const 141
    i32.const 33
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   i32.load offset=8
  else
   i32.const 0
  end
 )
 (func $assembly/grass/getMainShaderPointer (result i32)
  (local $0 i32)
  global.get $assembly/grass/mainShaderBuffer
  if (result i32)
   global.get $assembly/grass/mainShaderBuffer
   local.tee $0
   i32.eqz
   if
    i32.const 5856
    i32.const 5984
    i32.const 145
    i32.const 31
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   i32.load offset=4
  else
   i32.const 0
  end
 )
 (func $assembly/grass/getMainShaderLength (result i32)
  (local $0 i32)
  global.get $assembly/grass/mainShaderBuffer
  if (result i32)
   global.get $assembly/grass/mainShaderBuffer
   local.tee $0
   i32.eqz
   if
    i32.const 5856
    i32.const 5984
    i32.const 148
    i32.const 31
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   i32.load offset=8
  else
   i32.const 0
  end
 )
 (func $assembly/grass/getDepthShaderPointer (result i32)
  (local $0 i32)
  global.get $assembly/grass/depthShaderBuffer
  if (result i32)
   global.get $assembly/grass/depthShaderBuffer
   local.tee $0
   i32.eqz
   if
    i32.const 5856
    i32.const 5984
    i32.const 152
    i32.const 32
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   i32.load offset=4
  else
   i32.const 0
  end
 )
 (func $assembly/grass/getDepthShaderLength (result i32)
  (local $0 i32)
  global.get $assembly/grass/depthShaderBuffer
  if (result i32)
   global.get $assembly/grass/depthShaderBuffer
   local.tee $0
   i32.eqz
   if
    i32.const 5856
    i32.const 5984
    i32.const 155
    i32.const 32
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   i32.load offset=8
  else
   i32.const 0
  end
 )
 (func $assembly/grass/getPositionsPointer (result i32)
  global.get $assembly/grass/positionsBuffer
  i32.load offset=4
 )
 (func $assembly/grass/getIndicesPointer (result i32)
  global.get $assembly/grass/indicesBuffer
  i32.load offset=4
 )
 (func $assembly/grass/getClustersPointer (result i32)
  global.get $assembly/grass/clustersBuffer
  i32.load offset=4
 )
 (func $assembly/grass/getMatrixBufferPointer (result i32)
  global.get $assembly/grass/matrixBuffer
  i32.load offset=4
 )
 (func $assembly/grass/getFovHelperBufferPointer (result i32)
  global.get $assembly/grass/fovHelperBuffer
  i32.load offset=4
 )
 (func $~lib/math/NativeMath.cos (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (local $6 i32)
  (local $7 f64)
  (local $8 f64)
  (local $9 f64)
  local.get $0
  i64.reinterpret_f64
  local.tee $5
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $3
  i32.const 31
  i32.shr_u
  local.set $6
  local.get $3
  i32.const 2147483647
  i32.and
  local.tee $3
  i32.const 1072243195
  i32.le_u
  if
   local.get $3
   i32.const 1044816030
   i32.lt_u
   if
    f64.const 1
    return
   end
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $1
   f64.mul
   local.set $2
   f64.const 1
   local.get $1
   f64.const 0.5
   f64.mul
   local.tee $7
   f64.sub
   local.tee $8
   f64.const 1
   local.get $8
   f64.sub
   local.get $7
   f64.sub
   local.get $1
   local.get $1
   local.get $1
   local.get $1
   f64.const 2.480158728947673e-05
   f64.mul
   f64.const -0.001388888888887411
   f64.add
   f64.mul
   f64.const 0.0416666666666666
   f64.add
   f64.mul
   local.get $2
   local.get $2
   f64.mul
   local.get $1
   local.get $1
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.const 2.087572321298175e-09
   f64.add
   f64.mul
   f64.const -2.7557314351390663e-07
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $0
   f64.const 0
   f64.mul
   f64.sub
   f64.add
   f64.add
   return
  end
  local.get $3
  i32.const 2146435072
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.sub
   return
  end
  block $~lib/math/rempio2|inlined.1 (result i32)
   local.get $5
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   i32.const 2147483647
   i32.and
   local.tee $4
   i32.const 1073928572
   i32.lt_u
   if
    i32.const 1
    local.set $3
    local.get $6
    if (result f64)
     local.get $0
     f64.const 1.5707963267341256
     f64.add
     local.set $0
     i32.const -1
     local.set $3
     local.get $4
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const 6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const 6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const 6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const 2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const 2.0222662487959506e-21
      f64.add
     end
    else
     local.get $0
     f64.const -1.5707963267341256
     f64.add
     local.set $0
     local.get $4
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const -6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const -6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const -6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const -2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const -2.0222662487959506e-21
      f64.add
     end
    end
    local.set $1
    local.get $0
    global.set $~lib/math/rempio2_y0
    local.get $1
    global.set $~lib/math/rempio2_y1
    local.get $3
    br $~lib/math/rempio2|inlined.1
   end
   local.get $4
   i32.const 1094263291
   i32.lt_u
   if
    local.get $4
    i32.const 20
    i32.shr_u
    local.tee $3
    local.get $0
    local.get $0
    f64.const 0.6366197723675814
    f64.mul
    f64.nearest
    local.tee $7
    f64.const 1.5707963267341256
    f64.mul
    f64.sub
    local.tee $0
    local.get $7
    f64.const 6.077100506506192e-11
    f64.mul
    local.tee $2
    f64.sub
    local.tee $1
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 20
    i32.shr_u
    i32.const 2047
    i32.and
    i32.sub
    i32.const 16
    i32.gt_u
    if
     local.get $7
     f64.const 2.0222662487959506e-21
     f64.mul
     local.get $0
     local.get $0
     local.get $7
     f64.const 6.077100506303966e-11
     f64.mul
     local.tee $1
     f64.sub
     local.tee $0
     f64.sub
     local.get $1
     f64.sub
     f64.sub
     local.set $2
     local.get $3
     local.get $0
     local.get $2
     f64.sub
     local.tee $1
     i64.reinterpret_f64
     i64.const 32
     i64.shr_u
     i32.wrap_i64
     i32.const 20
     i32.shr_u
     i32.const 2047
     i32.and
     i32.sub
     i32.const 49
     i32.gt_u
     if
      local.get $7
      f64.const 8.4784276603689e-32
      f64.mul
      local.get $0
      local.get $0
      local.get $7
      f64.const 2.0222662487111665e-21
      f64.mul
      local.tee $1
      f64.sub
      local.tee $0
      f64.sub
      local.get $1
      f64.sub
      f64.sub
      local.set $2
      local.get $0
      local.get $2
      f64.sub
      local.set $1
     end
    end
    local.get $1
    global.set $~lib/math/rempio2_y0
    local.get $0
    local.get $1
    f64.sub
    local.get $2
    f64.sub
    global.set $~lib/math/rempio2_y1
    local.get $7
    i32.trunc_sat_f64_s
    br $~lib/math/rempio2|inlined.1
   end
   i32.const 0
   local.get $5
   call $~lib/math/pio2_large_quot
   local.tee $3
   i32.sub
   local.get $3
   local.get $6
   select
  end
  local.set $3
  global.get $~lib/math/rempio2_y0
  local.set $1
  global.get $~lib/math/rempio2_y1
  local.set $2
  local.get $3
  i32.const 1
  i32.and
  if (result f64)
   local.get $1
   local.get $1
   f64.mul
   local.tee $0
   local.get $1
   f64.mul
   local.set $7
   local.get $1
   local.get $0
   local.get $2
   f64.const 0.5
   f64.mul
   local.get $7
   local.get $0
   local.get $0
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.const -1.984126982985795e-04
   f64.add
   f64.mul
   f64.const 0.00833333333332249
   f64.add
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   f64.mul
   local.get $0
   f64.const 1.58969099521155e-10
   f64.mul
   f64.const -2.5050760253406863e-08
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.sub
   f64.mul
   local.get $2
   f64.sub
   local.get $7
   f64.const -0.16666666666666632
   f64.mul
   f64.sub
   f64.sub
  else
   local.get $1
   local.get $1
   f64.mul
   local.tee $7
   local.get $7
   f64.mul
   local.set $8
   f64.const 1
   local.get $7
   f64.const 0.5
   f64.mul
   local.tee $0
   f64.sub
   local.tee $9
   f64.const 1
   local.get $9
   f64.sub
   local.get $0
   f64.sub
   local.get $7
   local.get $7
   local.get $7
   local.get $7
   f64.const 2.480158728947673e-05
   f64.mul
   f64.const -0.001388888888887411
   f64.add
   f64.mul
   f64.const 0.0416666666666666
   f64.add
   f64.mul
   local.get $8
   local.get $8
   f64.mul
   local.get $7
   local.get $7
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.const 2.087572321298175e-09
   f64.add
   f64.mul
   f64.const -2.7557314351390663e-07
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $1
   local.get $2
   f64.mul
   f64.sub
   f64.add
   f64.add
  end
  local.tee $0
  f64.neg
  local.get $0
  local.get $3
  i32.const 1
  i32.add
  i32.const 2
  i32.and
  select
 )
 (func $~lib/math/tan_kern (param $0 f64) (param $1 f64) (param $2 i32) (result f64)
  (local $3 i32)
  (local $4 i32)
  (local $5 f64)
  (local $6 f64)
  (local $7 f64)
  local.get $0
  i64.reinterpret_f64
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $3
  i32.const 2147483647
  i32.and
  i32.const 1072010280
  i32.ge_u
  local.tee $4
  if
   f64.const 0.7853981633974483
   local.get $3
   i32.const 0
   i32.lt_s
   if (result f64)
    local.get $1
    f64.neg
    local.set $1
    local.get $0
    f64.neg
   else
    local.get $0
   end
   f64.sub
   f64.const 3.061616997868383e-17
   local.get $1
   f64.sub
   f64.add
   local.set $0
   f64.const 0
   local.set $1
  end
  local.get $0
  local.get $0
  f64.mul
  local.tee $5
  local.get $5
  f64.mul
  local.set $6
  local.get $0
  local.get $1
  local.get $5
  local.get $5
  local.get $0
  f64.mul
  local.tee $7
  local.get $6
  local.get $6
  local.get $6
  local.get $6
  local.get $6
  f64.const -1.8558637485527546e-05
  f64.mul
  f64.const 7.817944429395571e-05
  f64.add
  f64.mul
  f64.const 5.880412408202641e-04
  f64.add
  f64.mul
  f64.const 3.5920791075913124e-03
  f64.add
  f64.mul
  f64.const 0.021869488294859542
  f64.add
  f64.mul
  f64.const 0.13333333333320124
  f64.add
  local.get $5
  local.get $6
  local.get $6
  local.get $6
  local.get $6
  local.get $6
  f64.const 2.590730518636337e-05
  f64.mul
  f64.const 7.140724913826082e-05
  f64.add
  f64.mul
  f64.const 2.464631348184699e-04
  f64.add
  f64.mul
  f64.const 1.4562094543252903e-03
  f64.add
  f64.mul
  f64.const 0.0088632398235993
  f64.add
  f64.mul
  f64.const 0.05396825397622605
  f64.add
  f64.mul
  f64.add
  f64.mul
  local.get $1
  f64.add
  f64.mul
  f64.add
  local.get $7
  f64.const 0.3333333333333341
  f64.mul
  f64.add
  local.tee $1
  f64.add
  local.set $5
  local.get $4
  if
   f64.const 1
   local.get $3
   i32.const 30
   i32.shr_s
   i32.const 2
   i32.and
   f64.convert_i32_s
   f64.sub
   local.get $2
   f64.convert_i32_s
   local.tee $6
   local.get $0
   local.get $5
   local.get $5
   f64.mul
   local.get $5
   local.get $6
   f64.add
   f64.div
   local.get $1
   f64.sub
   f64.sub
   f64.const 2
   f64.mul
   f64.sub
   f64.mul
   return
  end
  local.get $2
  i32.const 1
  i32.eq
  if
   local.get $5
   return
  end
  f64.const -1
  local.get $5
  f64.div
  local.tee $6
  i64.reinterpret_f64
  i64.const -4294967296
  i64.and
  f64.reinterpret_i64
  local.tee $7
  local.get $6
  local.get $7
  local.get $5
  i64.reinterpret_f64
  i64.const -4294967296
  i64.and
  f64.reinterpret_i64
  local.tee $5
  f64.mul
  f64.const 1
  f64.add
  local.get $7
  local.get $1
  local.get $5
  local.get $0
  f64.sub
  f64.sub
  f64.mul
  f64.add
  f64.mul
  f64.add
 )
 (func $~lib/math/NativeMath.tan (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 i32)
  (local $3 i64)
  (local $4 f64)
  (local $5 f64)
  (local $6 i32)
  (local $7 i32)
  local.get $0
  i64.reinterpret_f64
  local.tee $3
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $2
  i32.const 31
  i32.shr_u
  local.set $6
  local.get $2
  i32.const 2147483647
  i32.and
  local.tee $2
  i32.const 1072243195
  i32.le_u
  if
   local.get $2
   i32.const 1044381696
   i32.lt_u
   if
    local.get $0
    return
   end
   local.get $0
   f64.const 0
   i32.const 1
   call $~lib/math/tan_kern
   return
  end
  local.get $2
  i32.const 2146435072
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.sub
   return
  end
  block $~lib/math/rempio2|inlined.2
   local.get $3
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   i32.const 2147483647
   i32.and
   local.tee $7
   i32.const 1073928572
   i32.lt_u
   if
    i32.const 1
    local.set $2
    local.get $6
    if (result f64)
     local.get $0
     f64.const 1.5707963267341256
     f64.add
     local.set $0
     i32.const -1
     local.set $2
     local.get $7
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const 6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const 6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const 6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const 2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const 2.0222662487959506e-21
      f64.add
     end
    else
     local.get $0
     f64.const -1.5707963267341256
     f64.add
     local.set $0
     local.get $7
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const -6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const -6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const -6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const -2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const -2.0222662487959506e-21
      f64.add
     end
    end
    local.set $1
    local.get $0
    global.set $~lib/math/rempio2_y0
    local.get $1
    global.set $~lib/math/rempio2_y1
    br $~lib/math/rempio2|inlined.2
   end
   local.get $7
   i32.const 1094263291
   i32.lt_u
   if
    local.get $7
    i32.const 20
    i32.shr_u
    local.tee $2
    local.get $0
    local.get $0
    f64.const 0.6366197723675814
    f64.mul
    f64.nearest
    local.tee $4
    f64.const 1.5707963267341256
    f64.mul
    f64.sub
    local.tee $0
    local.get $4
    f64.const 6.077100506506192e-11
    f64.mul
    local.tee $5
    f64.sub
    local.tee $1
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 20
    i32.shr_u
    i32.const 2047
    i32.and
    i32.sub
    i32.const 16
    i32.gt_u
    if
     local.get $4
     f64.const 2.0222662487959506e-21
     f64.mul
     local.get $0
     local.get $0
     local.get $4
     f64.const 6.077100506303966e-11
     f64.mul
     local.tee $1
     f64.sub
     local.tee $0
     f64.sub
     local.get $1
     f64.sub
     f64.sub
     local.set $5
     local.get $2
     local.get $0
     local.get $5
     f64.sub
     local.tee $1
     i64.reinterpret_f64
     i64.const 32
     i64.shr_u
     i32.wrap_i64
     i32.const 20
     i32.shr_u
     i32.const 2047
     i32.and
     i32.sub
     i32.const 49
     i32.gt_u
     if
      local.get $4
      f64.const 8.4784276603689e-32
      f64.mul
      local.get $0
      local.get $0
      local.get $4
      f64.const 2.0222662487111665e-21
      f64.mul
      local.tee $1
      f64.sub
      local.tee $0
      f64.sub
      local.get $1
      f64.sub
      f64.sub
      local.set $5
      local.get $0
      local.get $5
      f64.sub
      local.set $1
     end
    end
    local.get $1
    global.set $~lib/math/rempio2_y0
    local.get $0
    local.get $1
    f64.sub
    local.get $5
    f64.sub
    global.set $~lib/math/rempio2_y1
    local.get $4
    i32.trunc_sat_f64_s
    local.set $2
    br $~lib/math/rempio2|inlined.2
   end
   i32.const 0
   local.get $3
   call $~lib/math/pio2_large_quot
   local.tee $2
   i32.sub
   local.get $2
   local.get $6
   select
   local.set $2
  end
  global.get $~lib/math/rempio2_y0
  global.get $~lib/math/rempio2_y1
  i32.const 1
  local.get $2
  i32.const 1
  i32.and
  i32.const 1
  i32.shl
  i32.sub
  call $~lib/math/tan_kern
 )
 (func $~lib/math/NativeMath.atan (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 i32)
  (local $3 i32)
  (local $4 f64)
  (local $5 f64)
  local.get $0
  local.set $1
  local.get $0
  i64.reinterpret_f64
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  i32.const 2147483647
  i32.and
  local.tee $2
  i32.const 1141899264
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.ne
   if
    local.get $0
    return
   end
   f64.const 1.5707963267948966
   local.get $1
   f64.copysign
   return
  end
  local.get $2
  i32.const 1071382528
  i32.lt_u
  if
   local.get $2
   i32.const 1044381696
   i32.lt_u
   if
    local.get $0
    return
   end
   i32.const -1
   local.set $3
  else
   local.get $0
   f64.abs
   local.set $0
   local.get $2
   i32.const 1072889856
   i32.lt_u
   if (result f64)
    local.get $2
    i32.const 1072037888
    i32.lt_u
    if (result f64)
     local.get $0
     local.get $0
     f64.add
     f64.const -1
     f64.add
     local.get $0
     f64.const 2
     f64.add
     f64.div
    else
     i32.const 1
     local.set $3
     local.get $0
     f64.const -1
     f64.add
     local.get $0
     f64.const 1
     f64.add
     f64.div
    end
   else
    local.get $2
    i32.const 1073971200
    i32.lt_u
    if (result f64)
     i32.const 2
     local.set $3
     local.get $0
     f64.const -1.5
     f64.add
     local.get $0
     f64.const 1.5
     f64.mul
     f64.const 1
     f64.add
     f64.div
    else
     i32.const 3
     local.set $3
     f64.const -1
     local.get $0
     f64.div
    end
   end
   local.set $0
  end
  local.get $0
  local.get $0
  f64.mul
  local.tee $5
  local.get $5
  f64.mul
  local.set $4
  local.get $0
  local.get $5
  local.get $4
  local.get $4
  local.get $4
  local.get $4
  local.get $4
  f64.const 0.016285820115365782
  f64.mul
  f64.const 0.049768779946159324
  f64.add
  f64.mul
  f64.const 0.06661073137387531
  f64.add
  f64.mul
  f64.const 0.09090887133436507
  f64.add
  f64.mul
  f64.const 0.14285714272503466
  f64.add
  f64.mul
  f64.const 0.3333333333333293
  f64.add
  f64.mul
  local.get $4
  local.get $4
  local.get $4
  local.get $4
  local.get $4
  f64.const -0.036531572744216916
  f64.mul
  f64.const -0.058335701337905735
  f64.add
  f64.mul
  f64.const -0.0769187620504483
  f64.add
  f64.mul
  f64.const -0.11111110405462356
  f64.add
  f64.mul
  f64.const -0.19999999999876483
  f64.add
  f64.mul
  f64.add
  f64.mul
  local.set $4
  local.get $3
  i32.const 0
  i32.lt_s
  if
   local.get $0
   local.get $4
   f64.sub
   return
  end
  block $break|0
   block $case4|0
    block $case3|0
     block $case2|0
      block $case1|0
       block $case0|0
        local.get $3
        br_table $case0|0 $case1|0 $case2|0 $case3|0 $case4|0
       end
       f64.const 0.4636476090008061
       local.get $4
       f64.const -2.2698777452961687e-17
       f64.add
       local.get $0
       f64.sub
       f64.sub
       local.set $0
       br $break|0
      end
      f64.const 0.7853981633974483
      local.get $4
      f64.const -3.061616997868383e-17
      f64.add
      local.get $0
      f64.sub
      f64.sub
      local.set $0
      br $break|0
     end
     f64.const 0.982793723247329
     local.get $4
     f64.const -1.3903311031230998e-17
     f64.add
     local.get $0
     f64.sub
     f64.sub
     local.set $0
     br $break|0
    end
    f64.const 1.5707963267948966
    local.get $4
    f64.const -6.123233995736766e-17
    f64.add
    local.get $0
    f64.sub
    f64.sub
    local.set $0
    br $break|0
   end
   unreachable
  end
  local.get $0
  local.get $1
  f64.copysign
 )
 (func $assembly/grass/computeCamParamsWasm (param $0 f32) (param $1 f32) (param $2 f32) (result f32)
  (local $3 f64)
  local.get $0
  f32.const 0.01745329238474369
  f32.mul
  f64.promote_f32
  local.tee $3
  call $~lib/math/NativeMath.sin
  f32.demote_f64
  f32.neg
  global.set $assembly/grass/lastCamDirX
  local.get $3
  call $~lib/math/NativeMath.cos
  f32.demote_f64
  f32.neg
  global.set $assembly/grass/lastCamDirZ
  local.get $1
  f32.const 0.01745329238474369
  f32.mul
  f32.const 0.5
  f32.mul
  f64.promote_f32
  call $~lib/math/NativeMath.tan
  local.get $2
  f64.promote_f32
  f64.mul
  call $~lib/math/NativeMath.atan
  f32.demote_f64
  f32.const 0.05000000074505806
  f32.add
  f64.promote_f32
  call $~lib/math/NativeMath.cos
  f32.demote_f64
  global.set $assembly/grass/lastHalfFovCos
  global.get $assembly/grass/lastHalfFovCos
 )
 (func $assembly/grass/computeFovHelperLinesWasm (param $0 f32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 f32) (param $5 f32) (param $6 f32) (param $7 f32) (param $8 f32)
  (local $9 f64)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  local.get $5
  f32.const 0.01745329238474369
  f32.mul
  f32.const 3.1415927410125732
  f32.add
  local.tee $5
  local.get $6
  f32.const 0.01745329238474369
  f32.mul
  f32.const 0.5
  f32.mul
  f64.promote_f32
  call $~lib/math/NativeMath.tan
  local.get $7
  f64.promote_f32
  f64.mul
  call $~lib/math/NativeMath.atan
  f32.demote_f64
  f32.const 0.05000000074505806
  f32.add
  local.tee $6
  f32.sub
  local.set $7
  global.get $assembly/grass/fovHelperBuffer
  i32.const 0
  local.get $0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 1
  local.get $2
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 2
  local.get $1
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 3
  local.get $0
  local.get $5
  f64.promote_f32
  local.tee $9
  call $~lib/math/NativeMath.sin
  f32.demote_f64
  local.get $8
  f32.mul
  f32.add
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 4
  local.get $2
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 5
  local.get $1
  local.get $9
  call $~lib/math/NativeMath.cos
  f32.demote_f64
  local.get $8
  f32.mul
  f32.add
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 6
  local.get $0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 7
  local.get $2
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 8
  local.get $1
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 9
  local.get $0
  local.get $7
  f64.promote_f32
  local.tee $9
  call $~lib/math/NativeMath.sin
  f32.demote_f64
  local.get $8
  f32.mul
  f32.add
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 10
  local.get $2
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 11
  local.get $1
  local.get $9
  call $~lib/math/NativeMath.cos
  f32.demote_f64
  local.get $8
  f32.mul
  f32.add
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 12
  local.get $0
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 13
  local.get $2
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 14
  local.get $1
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 15
  local.get $0
  local.get $5
  local.get $6
  f32.add
  local.tee $0
  f64.promote_f32
  local.tee $9
  call $~lib/math/NativeMath.sin
  f32.demote_f64
  local.get $8
  f32.mul
  f32.add
  call $~lib/typedarray/Float32Array#__set
  global.get $assembly/grass/fovHelperBuffer
  i32.const 16
  local.get $2
  call $~lib/typedarray/Float32Array#__set
  i32.const 18
  local.set $10
  global.get $assembly/grass/fovHelperBuffer
  i32.const 17
  local.get $1
  local.get $9
  call $~lib/math/NativeMath.cos
  f32.demote_f64
  local.get $8
  f32.mul
  f32.add
  call $~lib/typedarray/Float32Array#__set
  loop $for-loop|0
   local.get $11
   i32.const 32
   i32.lt_s
   if
    global.get $assembly/grass/fovHelperBuffer
    local.get $10
    local.get $3
    local.get $7
    local.get $0
    local.get $7
    f32.sub
    local.tee $1
    local.get $11
    f32.convert_i32_s
    f32.const 0.03125
    f32.mul
    f32.mul
    f32.add
    f64.promote_f32
    local.tee $9
    call $~lib/math/NativeMath.sin
    f32.demote_f64
    local.get $8
    f32.mul
    f32.add
    call $~lib/typedarray/Float32Array#__set
    local.get $10
    i32.const 1
    i32.add
    local.tee $10
    i32.const 1
    i32.add
    local.set $12
    global.get $assembly/grass/fovHelperBuffer
    local.get $10
    local.get $2
    call $~lib/typedarray/Float32Array#__set
    global.get $assembly/grass/fovHelperBuffer
    local.get $12
    local.get $4
    local.get $9
    call $~lib/math/NativeMath.cos
    f32.demote_f64
    local.get $8
    f32.mul
    f32.add
    call $~lib/typedarray/Float32Array#__set
    local.get $12
    i32.const 1
    i32.add
    local.tee $10
    i32.const 1
    i32.add
    local.set $12
    global.get $assembly/grass/fovHelperBuffer
    local.get $10
    local.get $3
    local.get $7
    local.get $1
    local.get $11
    i32.const 1
    i32.add
    local.tee $11
    f32.convert_i32_s
    f32.const 0.03125
    f32.mul
    f32.mul
    f32.add
    f64.promote_f32
    local.tee $9
    call $~lib/math/NativeMath.sin
    f32.demote_f64
    local.get $8
    f32.mul
    f32.add
    call $~lib/typedarray/Float32Array#__set
    global.get $assembly/grass/fovHelperBuffer
    local.get $12
    local.get $2
    call $~lib/typedarray/Float32Array#__set
    local.get $12
    i32.const 1
    i32.add
    local.tee $12
    i32.const 1
    i32.add
    local.set $10
    global.get $assembly/grass/fovHelperBuffer
    local.get $12
    local.get $4
    local.get $9
    call $~lib/math/NativeMath.cos
    f32.demote_f64
    local.get $8
    f32.mul
    f32.add
    call $~lib/typedarray/Float32Array#__set
    br $for-loop|0
   end
  end
 )
 (func $assembly/grass/seedChunkWasm (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32)
  (local $5 f32)
  (local $6 i32)
  (local $7 f32)
  (local $8 f32)
  (local $9 f32)
  (local $10 f64)
  (local $11 f32)
  (local $12 i32)
  (local $13 f32)
  (local $14 f32)
  local.get $0
  f32.convert_i32_s
  f32.const 400
  f32.mul
  f32.const -200
  f32.add
  local.set $8
  local.get $1
  f32.convert_i32_s
  f32.const 400
  f32.mul
  f32.const -200
  f32.add
  local.set $9
  loop $for-loop|0
   local.get $3
   local.get $6
   i32.gt_s
   if
    local.get $2
    local.get $6
    i32.add
    local.tee $12
    local.get $4
    i32.lt_s
    if
     local.get $0
     f32.convert_i32_s
     f32.const 12.989800453186035
     f32.mul
     local.get $1
     f32.convert_i32_s
     f32.const 78.23300170898438
     f32.mul
     f32.add
     local.get $6
     f32.convert_i32_s
     f32.const 43758.546875
     f32.mul
     f32.add
     local.tee $11
     f32.const 19.190000534057617
     f32.add
     f64.promote_f32
     call $~lib/math/NativeMath.sin
     f32.demote_f64
     f32.const 43758.546875
     f32.mul
     local.set $5
     local.get $11
     f32.const 38.380001068115234
     f32.add
     f64.promote_f32
     call $~lib/math/NativeMath.sin
     f32.demote_f64
     f32.const 43758.546875
     f32.mul
     local.set $7
     local.get $11
     f32.const 57.56999969482422
     f32.add
     f64.promote_f32
     call $~lib/math/NativeMath.sin
     f32.demote_f64
     f32.const 43758.546875
     f32.mul
     local.set $13
     local.get $11
     f32.const 76.76000213623047
     f32.add
     f64.promote_f32
     call $~lib/math/NativeMath.sin
     f32.demote_f64
     f32.const 43758.546875
     f32.mul
     local.tee $11
     local.get $11
     f64.promote_f32
     f64.floor
     f32.demote_f64
     f32.sub
     f32.const 1.5499999523162842
     f32.mul
     f32.const 0.8500000238418579
     f32.add
     local.set $11
     local.get $13
     local.get $13
     f64.promote_f32
     f64.floor
     f32.demote_f64
     f32.sub
     f32.const 6.2831854820251465
     f32.mul
     f64.promote_f32
     local.tee $10
     call $~lib/math/NativeMath.cos
     f32.demote_f64
     local.get $11
     f32.mul
     local.set $13
     local.get $10
     call $~lib/math/NativeMath.sin
     f32.demote_f64
     local.get $11
     f32.mul
     local.set $14
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 4
     i32.shl
     local.tee $12
     local.get $13
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 1
     i32.add
     f32.const 0
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 2
     i32.add
     local.get $14
     f32.neg
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 3
     i32.add
     f32.const 0
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 4
     i32.add
     f32.const 0
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 5
     i32.add
     local.get $11
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 6
     i32.add
     f32.const 0
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 7
     i32.add
     f32.const 0
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 8
     i32.add
     local.get $14
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 9
     i32.add
     f32.const 0
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 10
     i32.add
     local.get $13
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 11
     i32.add
     f32.const 0
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 12
     i32.add
     local.get $8
     local.get $5
     local.get $5
     f64.promote_f32
     f64.floor
     f32.demote_f64
     f32.sub
     f32.const 400
     f32.mul
     f32.add
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 13
     i32.add
     f32.const 0
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 14
     i32.add
     local.get $9
     local.get $7
     local.get $7
     f64.promote_f32
     f64.floor
     f32.demote_f64
     f32.sub
     f32.const 400
     f32.mul
     f32.add
     call $~lib/typedarray/Float32Array#__set
     global.get $assembly/grass/matrixBuffer
     local.get $12
     i32.const 15
     i32.add
     f32.const 1
     call $~lib/typedarray/Float32Array#__set
     local.get $6
     i32.const 1
     i32.add
     local.set $6
     br $for-loop|0
    end
   end
  end
 )
 (func $assembly/grass/updateRollingGridWasm (param $0 f32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 i32) (result i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  local.get $1
  local.get $3
  f32.const 600
  f32.mul
  f32.add
  f32.const 200
  f32.add
  f32.const 400
  f32.div
  f64.promote_f32
  f64.floor
  i32.trunc_sat_f64_s
  local.tee $6
  global.get $assembly/grass/activeGridZ
  i32.eq
  local.get $0
  local.get $2
  f32.const 600
  f32.mul
  f32.add
  f32.const 200
  f32.add
  f32.const 400
  f32.div
  f64.promote_f32
  f64.floor
  i32.trunc_sat_f64_s
  local.tee $7
  global.get $assembly/grass/activeGridX
  i32.eq
  i32.and
  if
   i32.const 0
   return
  end
  local.get $7
  global.set $assembly/grass/activeGridX
  local.get $6
  global.set $assembly/grass/activeGridZ
  i32.const 80000
  local.get $4
  local.get $4
  i32.const 80000
  i32.ge_s
  select
  local.tee $10
  i32.const 121
  i32.div_s
  local.set $8
  local.get $7
  i32.const 5
  i32.sub
  local.set $4
  loop $for-loop|0
   local.get $4
   local.get $7
   i32.const 5
   i32.add
   i32.le_s
   if
    local.get $6
    i32.const 5
    i32.sub
    local.set $5
    loop $for-loop|1
     local.get $5
     local.get $6
     i32.const 5
     i32.add
     i32.le_s
     if
      local.get $4
      local.get $5
      local.get $8
      local.get $9
      i32.mul
      local.get $8
      local.get $10
      call $assembly/grass/seedChunkWasm
      local.get $9
      i32.const 1
      i32.add
      local.set $9
      local.get $5
      i32.const 1
      i32.add
      local.set $5
      br $for-loop|1
     end
    end
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|0
   end
  end
  i32.const 1
 )
 (func $~lib/rt/stub/__pin (param $0 i32) (result i32)
  local.get $0
 )
 (func $~lib/rt/stub/__unpin (param $0 i32)
 )
 (func $~lib/rt/stub/__collect
 )
 (func $~start
  i32.const 6076
  global.set $~lib/rt/stub/offset
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 1280000
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $assembly/grass/matrixBuffer
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 48
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $assembly/grass/positionsBuffer
  i32.const 12
  i32.const 5
  call $~lib/rt/stub/__new
  i32.const 24
  i32.const 1
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $assembly/grass/indicesBuffer
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 16
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $assembly/grass/clustersBuffer
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 210
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $assembly/grass/fovHelperBuffer
 )
)
